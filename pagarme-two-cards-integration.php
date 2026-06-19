<?php
/**
 * Integração Pagar.me - Suporte a Dois Cartões
 * Extensão para WooCommerce + Pagar.me permitir pagamento dividido em dois cartões
 * Autor: Cursor AI para Marília Miranda
 */

// Previne acesso direto
if (!defined('ABSPATH')) {
    exit;
}

class PagarMeTwoCardsIntegration {
    
    public function __construct() {
        add_action('woocommerce_checkout_order_processed', array($this, 'handle_two_cards_payment'), 10, 1);
        add_action('wp_ajax_validate_two_cards', array($this, 'validate_two_cards_ajax'));
        add_action('wp_ajax_nopriv_validate_two_cards', array($this, 'validate_two_cards_ajax'));
        add_filter('woocommerce_gateway_pagarme_process_payment_data', array($this, 'modify_payment_data'), 10, 2);
    }
    
    /**
     * Processa pagamento com dois cartões
     */
    public function handle_two_cards_payment($order_id) {
        // Verifica se é pagamento com dois cartões
        if (!isset($_POST['second_card_name']) || empty($_POST['second_card_name'])) {
            return;
        }
        
        $order = wc_get_order($order_id);
        if (!$order) {
            return;
        }
        
        // Coleta dados dos cartões
        $first_card_data = $this->get_first_card_data();
        $second_card_data = $this->get_second_card_data();
        
        // Valida dados
        if (!$this->validate_cards_data($first_card_data, $second_card_data)) {
            wc_add_notice('Dados dos cartões inválidos', 'error');
            return;
        }
        
        // Salva dados no pedido
        update_post_meta($order_id, '_payment_method_two_cards', 'yes');
        update_post_meta($order_id, '_first_card_data', $first_card_data);
        update_post_meta($order_id, '_second_card_data', $second_card_data);
        
        // Processa pagamento dividido
        $this->process_split_payment($order, $first_card_data, $second_card_data);
    }
    
    /**
     * Coleta dados do primeiro cartão
     */
    private function get_first_card_data() {
        return array(
            'name' => sanitize_text_field($_POST['pagarme_credit_card_holder_name'] ?? ''),
            'number' => sanitize_text_field($_POST['pagarme_credit_card_number'] ?? ''),
            'expiry' => sanitize_text_field($_POST['pagarme_credit_card_expiry_date'] ?? ''),
            'cvv' => sanitize_text_field($_POST['pagarme_credit_card_cvv'] ?? ''),
            'amount' => floatval($_POST['first_card_amount'] ?? 0)
        );
    }
    
    /**
     * Coleta dados do segundo cartão
     */
    private function get_second_card_data() {
        return array(
            'name' => sanitize_text_field($_POST['second_card_name'] ?? ''),
            'number' => sanitize_text_field($_POST['second_card_number'] ?? ''),
            'expiry' => sanitize_text_field($_POST['second_card_expiry'] ?? ''),
            'cvv' => sanitize_text_field($_POST['second_card_cvv'] ?? ''),
            'amount' => floatval($_POST['second_card_amount'] ?? 0)
        );
    }
    
    /**
     * Valida dados dos cartões
     */
    private function validate_cards_data($first_card, $second_card) {
        // Validação do primeiro cartão
        if (empty($first_card['name']) || empty($first_card['number']) || 
            empty($first_card['expiry']) || empty($first_card['cvv'])) {
            return false;
        }
        
        // Validação do segundo cartão
        if (empty($second_card['name']) || empty($second_card['number']) || 
            empty($second_card['expiry']) || empty($second_card['cvv'])) {
            return false;
        }
        
        // Validação dos valores
        if ($first_card['amount'] <= 0 || $second_card['amount'] <= 0) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Processa pagamento dividido via API Pagar.me
     */
    private function process_split_payment($order, $first_card, $second_card) {
        try {
            // Configurações da API Pagar.me
            $api_key = $this->get_pagarme_api_key();
            
            if (!$api_key) {
                throw new Exception('Chave API Pagar.me não configurada');
            }
            
            // Primeira transação
            $first_transaction = $this->create_card_transaction($order, $first_card, 1);
            
            if ($first_transaction['status'] !== 'paid') {
                throw new Exception('Falha no pagamento do primeiro cartão');
            }
            
            // Segunda transação
            $second_transaction = $this->create_card_transaction($order, $second_card, 2);
            
            if ($second_transaction['status'] !== 'paid') {
                // Se segunda falhou, tentar estornar a primeira
                $this->refund_transaction($first_transaction['id']);
                throw new Exception('Falha no pagamento do segundo cartão');
            }
            
            // Salva IDs das transações
            update_post_meta($order->get_id(), '_pagarme_first_transaction_id', $first_transaction['id']);
            update_post_meta($order->get_id(), '_pagarme_second_transaction_id', $second_transaction['id']);
            
            // Marca pedido como pago
            $order->payment_complete();
            $order->add_order_note('Pagamento aprovado com dois cartões - Transações: ' . 
                                  $first_transaction['id'] . ' e ' . $second_transaction['id']);
            
        } catch (Exception $e) {
            $order->add_order_note('Erro no pagamento com dois cartões: ' . $e->getMessage());
            wc_add_notice('Erro no processamento do pagamento: ' . $e->getMessage(), 'error');
        }
    }
    
    /**
     * Cria transação de cartão via API Pagar.me
     */
    private function create_card_transaction($order, $card_data, $card_number) {
        $api_key = $this->get_pagarme_api_key();
        
        // Dados da transação
        $transaction_data = array(
            'amount' => intval($card_data['amount'] * 100), // Valor em centavos
            'payment_method' => 'credit_card',
            'card_number' => preg_replace('/\D/', '', $card_data['number']),
            'card_holder_name' => $card_data['name'],
            'card_expiration_date' => str_replace('/', '', $card_data['expiry']),
            'card_cvv' => $card_data['cvv'],
            'customer' => array(
                'external_id' => $order->get_customer_id(),
                'name' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
                'email' => $order->get_billing_email(),
                'type' => 'individual',
                'country' => 'br',
                'phone_numbers' => array('+55' . preg_replace('/\D/', '', $order->get_billing_phone())),
                'documents' => array(
                    array(
                        'type' => 'cpf',
                        'number' => preg_replace('/\D/', '', get_post_meta($order->get_id(), '_billing_cpf', true))
                    )
                )
            ),
            'billing' => array(
                'name' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
                'address' => array(
                    'country' => 'br',
                    'state' => $order->get_billing_state(),
                    'city' => $order->get_billing_city(),
                    'neighborhood' => '',
                    'street' => $order->get_billing_address_1(),
                    'street_number' => get_post_meta($order->get_id(), '_billing_number', true),
                    'zipcode' => preg_replace('/\D/', '', $order->get_billing_postcode())
                )
            ),
            'items' => $this->get_order_items($order, $card_data['amount']),
            'metadata' => array(
                'order_id' => $order->get_id(),
                'card_number' => $card_number,
                'split_payment' => 'yes'
            )
        );
        
        // Faz requisição para API Pagar.me
        $response = wp_remote_post('https://api.pagar.me/1/transactions', array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($api_key . ':')
            ),
            'body' => json_encode($transaction_data),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            throw new Exception('Erro na comunicação com Pagar.me: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['errors'])) {
            throw new Exception('Erro Pagar.me: ' . implode(', ', array_map(function($error) {
                return $error['message'];
            }, $data['errors'])));
        }
        
        return $data;
    }
    
    /**
     * Obtém chave API do Pagar.me
     */
    private function get_pagarme_api_key() {
        // Tenta diferentes métodos de obter a chave API
        $gateways = WC()->payment_gateways->get_available_payment_gateways();
        
        foreach ($gateways as $gateway) {
            if (strpos($gateway->id, 'pagarme') !== false) {
                if (isset($gateway->api_key)) {
                    return $gateway->api_key;
                }
                if (isset($gateway->settings['api_key'])) {
                    return $gateway->settings['api_key'];
                }
            }
        }
        
        return false;
    }
    
    /**
     * Converte itens do pedido para formato Pagar.me
     */
    private function get_order_items($order, $amount) {
        $items = array();
        $total_order = $order->get_total();
        $proportion = $amount / $total_order;
        
        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            $item_total = floatval($item->get_total()) * $proportion;
            
            $items[] = array(
                'id' => $product->get_id(),
                'title' => $item->get_name(),
                'unit_price' => intval($item_total * 100), // Em centavos
                'quantity' => 1,
                'tangible' => false
            );
        }
        
        return $items;
    }
    
    /**
     * Estorna transação
     */
    private function refund_transaction($transaction_id) {
        $api_key = $this->get_pagarme_api_key();
        
        wp_remote_post("https://api.pagar.me/1/transactions/{$transaction_id}/refund", array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($api_key . ':')
            ),
            'timeout' => 60
        ));
    }
    
    /**
     * Validação AJAX para dois cartões
     */
    public function validate_two_cards_ajax() {
        check_ajax_referer('checkout_nonce', 'nonce');
        
        $first_amount = floatval($_POST['first_amount'] ?? 0);
        $second_amount = floatval($_POST['second_amount'] ?? 0);
        $total_amount = floatval($_POST['total_amount'] ?? 0);
        
        $sum = $first_amount + $second_amount;
        $valid = abs($sum - $total_amount) < 0.01; // Tolerância de 1 centavo
        
        wp_send_json(array(
            'valid' => $valid,
            'message' => $valid ? 'Valores válidos' : 'A soma dos cartões deve ser igual ao total'
        ));
    }
    
    /**
     * Modifica dados de pagamento do Pagar.me
     */
    public function modify_payment_data($payment_data, $order) {
        // Se for pagamento com dois cartões, intercepta e modifica o fluxo
        if (get_post_meta($order->get_id(), '_payment_method_two_cards', true) === 'yes') {
            // Aqui você pode modificar como quiser o fluxo de pagamento
            // Para integrar melhor com o plugin específico do Pagar.me usado
        }
        
        return $payment_data;
    }
}

// Inicializa a integração
new PagarMeTwoCardsIntegration();

/**
 * Função auxiliar para adicionar scripts de validação
 */
function add_two_cards_validation_script() {
    if (is_checkout()) {
        ?>
        <script type="text/javascript">
        jQuery(document).ready(function($) {
            // Validação em tempo real da soma dos cartões
            $(document).on('input', '#card1-amount, #card2-amount', function() {
                const card1Amount = parseFloat($('#card1-amount').val()) || 0;
                const card2Amount = parseFloat($('#card2-amount').val()) || 0;
                const totalAmount = parseFloat($('.order-total .woocommerce-Price-amount').text().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                
                const sum = card1Amount + card2Amount;
                const difference = Math.abs(sum - totalAmount);
                
                if (difference > 0.01) {
                    $('.complete-purchase-btn').prop('disabled', true).text('⚠️ Valores não conferem');
                } else {
                    $('.complete-purchase-btn').prop('disabled', false).text('🔒 Finalizar Compra Segura');
                }
            });
            
            // AJAX para validação de cartões
            function validateTwoCards() {
                $.post(wc_checkout_params.ajax_url, {
                    action: 'validate_two_cards',
                    nonce: wc_checkout_params.checkout_nonce,
                    first_amount: $('#card1-amount').val(),
                    second_amount: $('#card2-amount').val(),
                    total_amount: $('.order-total .woocommerce-Price-amount').text().replace(/[^\d,]/g, '').replace(',', '.')
                }, function(response) {
                    if (!response.valid) {
                        alert(response.message);
                    }
                });
            }
        });
        </script>
        <?php
    }
}
add_action('wp_footer', 'add_two_cards_validation_script');

/**
 * Adiciona campos de metadados para admin
 */
function add_two_cards_meta_box() {
    add_meta_box(
        'two_cards_payment_details',
        'Detalhes do Pagamento (Dois Cartões)',
        'display_two_cards_meta_box',
        'shop_order',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'add_two_cards_meta_box');

/**
 * Exibe metabox com detalhes dos dois cartões
 */
function display_two_cards_meta_box($post) {
    $order_id = $post->ID;
    $is_two_cards = get_post_meta($order_id, '_payment_method_two_cards', true);
    
    if ($is_two_cards !== 'yes') {
        echo '<p>Este pedido não foi pago com dois cartões.</p>';
        return;
    }
    
    $first_card = get_post_meta($order_id, '_first_card_data', true);
    $second_card = get_post_meta($order_id, '_second_card_data', true);
    $first_transaction = get_post_meta($order_id, '_pagarme_first_transaction_id', true);
    $second_transaction = get_post_meta($order_id, '_pagarme_second_transaction_id', true);
    
    ?>
    <table class="widefat">
        <thead>
            <tr>
                <th>Cartão</th>
                <th>Portador</th>
                <th>Final</th>
                <th>Valor</th>
                <th>Transação ID</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>1º Cartão</strong></td>
                <td><?php echo esc_html($first_card['name'] ?? ''); ?></td>
                <td>****<?php echo esc_html(substr($first_card['number'] ?? '', -4)); ?></td>
                <td>R$ <?php echo number_format($first_card['amount'] ?? 0, 2, ',', '.'); ?></td>
                <td><?php echo esc_html($first_transaction); ?></td>
            </tr>
            <tr>
                <td><strong>2º Cartão</strong></td>
                <td><?php echo esc_html($second_card['name'] ?? ''); ?></td>
                <td>****<?php echo esc_html(substr($second_card['number'] ?? '', -4)); ?></td>
                <td>R$ <?php echo number_format($second_card['amount'] ?? 0, 2, ',', '.'); ?></td>
                <td><?php echo esc_html($second_transaction); ?></td>
            </tr>
        </tbody>
    </table>
    <?php
}
?>