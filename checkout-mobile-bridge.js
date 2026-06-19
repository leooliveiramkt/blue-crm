/**
 * CHECKOUT MOBILE BRIDGE - Solução para Formulário Flutuante
 * Sincroniza dados entre formulário mobile otimizado e WooCommerce + Pagar.me
 * Autor: Cursor AI para Marília Miranda
 */

class CheckoutMobileBridge {
    constructor() {
        this.floatingForm = null;
        this.nativeForm = null;
        this.isMobile = this.detectMobile();
        this.formData = {};
        
        this.init();
    }

    // Detecta se é dispositivo mobile
    detectMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Inicializa o sistema
    init() {
        if (this.isMobile) {
            this.createFloatingForm();
            this.hideNativeForm();
            this.setupEventListeners();
        }
        
        this.setupFormValidation();
    }

    // Cria formulário flutuante otimizado para mobile
    createFloatingForm() {
        const floatingFormHTML = `
            <div id="floating-checkout-form" class="floating-form-overlay">
                <div class="floating-form-container">
                    <div class="floating-form-header">
                        <h3>🛒 Finalizar Compra</h3>
                        <button type="button" class="close-floating-form">×</button>
                    </div>
                    
                    <div class="floating-form-content">
                        <!-- Dados Pessoais -->
                        <div class="form-section">
                            <h4>📋 Dados Pessoais</h4>
                            <input type="text" id="floating-first-name" placeholder="Nome *" required>
                            <input type="text" id="floating-last-name" placeholder="Sobrenome *" required>
                            <input type="email" id="floating-email" placeholder="E-mail *" required>
                            <input type="tel" id="floating-phone" placeholder="Telefone *" required>
                            <input type="text" id="floating-cpf" placeholder="CPF *" required>
                        </div>

                        <!-- Endereço -->
                        <div class="form-section">
                            <h4>📍 Endereço</h4>
                            <input type="text" id="floating-zip" placeholder="CEP *" required>
                            <input type="text" id="floating-address" placeholder="Endereço *" required>
                            <input type="text" id="floating-number" placeholder="Número *" required>
                            <input type="text" id="floating-city" placeholder="Cidade *" required>
                            <select id="floating-state" required>
                                <option value="">Estado *</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <!-- Adicionar outros estados -->
                            </select>
                        </div>

                        <!-- Forma de Pagamento -->
                        <div class="form-section">
                            <h4>💳 Forma de Pagamento</h4>
                            <div class="payment-options">
                                <label class="payment-option">
                                    <input type="radio" name="payment-method" value="credit-card" checked>
                                    <span>Cartão de Crédito</span>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="payment-method" value="two-cards">
                                    <span>Dividir em 2 Cartões</span>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="payment-method" value="pix">
                                    <span>PIX (5% desconto)</span>
                                </label>
                            </div>
                        </div>

                        <!-- Dados do Cartão -->
                        <div class="form-section card-section">
                            <h4>💳 Dados do Cartão</h4>
                            <input type="text" id="floating-card-name" placeholder="Nome no cartão *">
                            <input type="text" id="floating-card-number" placeholder="Número do cartão *" maxlength="19">
                            <div class="card-row">
                                <input type="text" id="floating-card-expiry" placeholder="MM/AA *" maxlength="5">
                                <input type="text" id="floating-card-cvv" placeholder="CVV *" maxlength="4">
                            </div>
                            <select id="floating-installments">
                                <option value="1">1x R$ 497,00</option>
                                <option value="2">2x R$ 248,50</option>
                                <option value="3">3x R$ 165,67</option>
                                <option value="6">6x R$ 82,83</option>
                                <option value="12">12x R$ 41,42</option>
                            </select>
                        </div>

                        <!-- Segundo Cartão (apenas se selecionado) -->
                        <div class="form-section second-card-section" style="display: none;">
                            <h4>💳 Segundo Cartão</h4>
                            <input type="text" id="floating-card2-name" placeholder="Nome no cartão *">
                            <input type="text" id="floating-card2-number" placeholder="Número do cartão *" maxlength="19">
                            <div class="card-row">
                                <input type="text" id="floating-card2-expiry" placeholder="MM/AA *" maxlength="5">
                                <input type="text" id="floating-card2-cvv" placeholder="CVV *" maxlength="4">
                            </div>
                            <div class="split-amount">
                                <label>Valor no 1º cartão: <input type="number" id="card1-amount" value="248.50" step="0.01"></label>
                                <label>Valor no 2º cartão: <input type="number" id="card2-amount" value="248.50" step="0.01"></label>
                            </div>
                        </div>

                        <button type="button" class="complete-purchase-btn">
                            🔒 Finalizar Compra Segura
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', floatingFormHTML);
        this.floatingForm = document.getElementById('floating-checkout-form');
    }

    // Esconde formulário nativo e mostra botão para abrir flutuante
    hideNativeForm() {
        const nativeForm = document.querySelector('.woocommerce-checkout');
        if (nativeForm) {
            nativeForm.style.display = 'none';
            
            // Cria botão para abrir formulário flutuante
            const openButton = document.createElement('button');
            openButton.className = 'open-floating-checkout';
            openButton.innerHTML = '📱 Finalizar Compra (Mobile Otimizado)';
            openButton.onclick = () => this.showFloatingForm();
            
            nativeForm.parentNode.insertBefore(openButton, nativeForm);
        }
    }

    // Configura eventos
    setupEventListeners() {
        // Abrir/fechar formulário flutuante
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('open-floating-checkout')) {
                this.showFloatingForm();
            }
            if (e.target.classList.contains('close-floating-form')) {
                this.hideFloatingForm();
            }
        });

        // Mudança de método de pagamento
        document.addEventListener('change', (e) => {
            if (e.target.name === 'payment-method') {
                this.handlePaymentMethodChange(e.target.value);
            }
        });

        // Finalizar compra
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('complete-purchase-btn')) {
                this.processPurchase();
            }
        });

        // Formatação automática de campos
        this.setupFieldFormatting();

        // CEP autocomplete
        this.setupCepLookup();
    }

    // Formatação automática de campos
    setupFieldFormatting() {
        // CPF
        document.getElementById('floating-cpf')?.addEventListener('input', (e) => {
            e.target.value = this.formatCpf(e.target.value);
        });

        // Cartão
        document.getElementById('floating-card-number')?.addEventListener('input', (e) => {
            e.target.value = this.formatCardNumber(e.target.value);
        });

        // Data de expiração
        document.getElementById('floating-card-expiry')?.addEventListener('input', (e) => {
            e.target.value = this.formatExpiry(e.target.value);
        });

        // Telefone
        document.getElementById('floating-phone')?.addEventListener('input', (e) => {
            e.target.value = this.formatPhone(e.target.value);
        });
    }

    // Busca endereço por CEP
    setupCepLookup() {
        document.getElementById('floating-zip')?.addEventListener('blur', async (e) => {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        document.getElementById('floating-address').value = data.logradouro;
                        document.getElementById('floating-city').value = data.localidade;
                        document.getElementById('floating-state').value = data.uf;
                    }
                } catch (error) {
                    console.log('Erro ao buscar CEP:', error);
                }
            }
        });
    }

    // Mostra formulário flutuante
    showFloatingForm() {
        if (this.floatingForm) {
            this.floatingForm.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Esconde formulário flutuante
    hideFloatingForm() {
        if (this.floatingForm) {
            this.floatingForm.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Gerencia mudança de método de pagamento
    handlePaymentMethodChange(method) {
        const cardSection = document.querySelector('.card-section');
        const secondCardSection = document.querySelector('.second-card-section');

        switch (method) {
            case 'credit-card':
                cardSection.style.display = 'block';
                secondCardSection.style.display = 'none';
                break;
            case 'two-cards':
                cardSection.style.display = 'block';
                secondCardSection.style.display = 'block';
                break;
            case 'pix':
                cardSection.style.display = 'none';
                secondCardSection.style.display = 'none';
                break;
        }
    }

    // Processa a compra - FUNÇÃO PRINCIPAL
    async processPurchase() {
        try {
            // 1. Coleta dados do formulário flutuante
            const formData = this.collectFormData();
            
            // 2. Valida dados
            if (!this.validateFormData(formData)) {
                return;
            }

            // 3. Mostra loading
            this.showLoading();

            // 4. Transfere dados para formulário nativo WooCommerce
            this.transferDataToNativeForm(formData);

            // 5. Submete formulário nativo (que processará com Pagar.me)
            this.submitNativeForm();

        } catch (error) {
            this.showError('Erro ao processar compra: ' + error.message);
        }
    }

    // Coleta dados do formulário flutuante
    collectFormData() {
        return {
            // Dados pessoais
            firstName: document.getElementById('floating-first-name')?.value,
            lastName: document.getElementById('floating-last-name')?.value,
            email: document.getElementById('floating-email')?.value,
            phone: document.getElementById('floating-phone')?.value,
            cpf: document.getElementById('floating-cpf')?.value,
            
            // Endereço
            zip: document.getElementById('floating-zip')?.value,
            address: document.getElementById('floating-address')?.value,
            number: document.getElementById('floating-number')?.value,
            city: document.getElementById('floating-city')?.value,
            state: document.getElementById('floating-state')?.value,
            
            // Pagamento
            paymentMethod: document.querySelector('input[name="payment-method"]:checked')?.value,
            
            // Cartão 1
            cardName: document.getElementById('floating-card-name')?.value,
            cardNumber: document.getElementById('floating-card-number')?.value,
            cardExpiry: document.getElementById('floating-card-expiry')?.value,
            cardCvv: document.getElementById('floating-card-cvv')?.value,
            installments: document.getElementById('floating-installments')?.value,
            
            // Cartão 2 (se aplicável)
            card2Name: document.getElementById('floating-card2-name')?.value,
            card2Number: document.getElementById('floating-card2-number')?.value,
            card2Expiry: document.getElementById('floating-card2-expiry')?.value,
            card2Cvv: document.getElementById('floating-card2-cvv')?.value,
            card1Amount: document.getElementById('card1-amount')?.value,
            card2Amount: document.getElementById('card2-amount')?.value
        };
    }

    // Transfere dados para formulário nativo WooCommerce
    transferDataToNativeForm(data) {
        // Mapeia campos do formulário flutuante para campos nativos WooCommerce
        const fieldMapping = {
            'billing_first_name': data.firstName,
            'billing_last_name': data.lastName,
            'billing_email': data.email,
            'billing_phone': data.phone,
            'billing_cpf': data.cpf,
            'billing_postcode': data.zip,
            'billing_address_1': data.address,
            'billing_number': data.number,
            'billing_city': data.city,
            'billing_state': data.state,
            'billing_country': 'BR'
        };

        // Preenche campos nativos
        Object.entries(fieldMapping).forEach(([nativeField, value]) => {
            const field = document.querySelector(`[name="${nativeField}"]`);
            if (field && value) {
                field.value = value;
                // Dispara evento change para notificar WooCommerce
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Configura método de pagamento
        this.configurePaymentMethod(data);
    }

    // Configura método de pagamento no formulário nativo
    configurePaymentMethod(data) {
        // Seleciona método de pagamento correto
        let paymentMethodValue;
        switch (data.paymentMethod) {
            case 'credit-card':
                paymentMethodValue = 'woo-pagarme-payments-credit_card';
                break;
            case 'two-cards':
                paymentMethodValue = 'woo-pagarme-payments-credit_card'; // Usar campo customizado
                break;
            case 'pix':
                paymentMethodValue = 'woo-pagarme-payments-pix';
                break;
        }

        const paymentRadio = document.querySelector(`input[value="${paymentMethodValue}"]`);
        if (paymentRadio) {
            paymentRadio.checked = true;
            paymentRadio.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Preenche dados do cartão se necessário
        if (data.paymentMethod !== 'pix') {
            setTimeout(() => this.fillCardData(data), 500);
        }
    }

    // Preenche dados do cartão no formulário Pagar.me
    fillCardData(data) {
        const cardFields = {
            'pagarme_credit_card_holder_name': data.cardName,
            'pagarme_credit_card_number': data.cardNumber.replace(/\s/g, ''),
            'pagarme_credit_card_expiry_date': data.cardExpiry,
            'pagarme_credit_card_cvv': data.cardCvv,
            'pagarme_credit_card_installments': data.installments
        };

        Object.entries(cardFields).forEach(([field, value]) => {
            const element = document.querySelector(`[name="${field}"]`) || 
                          document.querySelector(`#${field}`);
            if (element && value) {
                element.value = value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        // Para dois cartões, configurar lógica especial
        if (data.paymentMethod === 'two-cards') {
            this.configureTwoCards(data);
        }
    }

    // Configura pagamento com dois cartões
    configureTwoCards(data) {
        // Lógica específica para dois cartões
        // Pode necessitar customização baseada no plugin Pagar.me usado
        console.log('Configurando dois cartões:', data.card1Amount, data.card2Amount);
        
        // Adicionar campos hidden com dados do segundo cartão
        const form = document.querySelector('.woocommerce-checkout');
        if (form) {
            const hiddenFields = [
                { name: 'second_card_name', value: data.card2Name },
                { name: 'second_card_number', value: data.card2Number },
                { name: 'second_card_expiry', value: data.card2Expiry },
                { name: 'second_card_cvv', value: data.card2Cvv },
                { name: 'first_card_amount', value: data.card1Amount },
                { name: 'second_card_amount', value: data.card2Amount }
            ];

            hiddenFields.forEach(field => {
                let hiddenInput = document.querySelector(`[name="${field.name}"]`);
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = field.name;
                    form.appendChild(hiddenInput);
                }
                hiddenInput.value = field.value;
            });
        }
    }

    // Submete formulário nativo
    submitNativeForm() {
        const nativeForm = document.querySelector('.woocommerce-checkout');
        if (nativeForm) {
            // Esconde formulário flutuante
            this.hideFloatingForm();
            
            // Mostra formulário nativo temporariamente para processamento
            nativeForm.style.display = 'block';
            
            // Submete formulário
            const submitButton = nativeForm.querySelector('[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }

    // Validação de dados
    validateFormData(data) {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'cpf'];
        
        for (let field of requiredFields) {
            if (!data[field]) {
                this.showError(`Campo obrigatório: ${field}`);
                return false;
            }
        }

        // Validações específicas
        if (!this.validateEmail(data.email)) {
            this.showError('E-mail inválido');
            return false;
        }

        if (!this.validateCpf(data.cpf)) {
            this.showError('CPF inválido');
            return false;
        }

        if (data.paymentMethod !== 'pix' && !this.validateCard(data)) {
            return false;
        }

        return true;
    }

    // Funções de formatação
    formatCpf(value) {
        return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    formatCardNumber(value) {
        return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    formatExpiry(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
    }

    formatPhone(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Funções de validação
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validateCpf(cpf) {
        // Implementar validação de CPF
        return cpf.replace(/\D/g, '').length === 11;
    }

    validateCard(data) {
        if (!data.cardName || !data.cardNumber || !data.cardExpiry || !data.cardCvv) {
            this.showError('Dados do cartão incompletos');
            return false;
        }
        return true;
    }

    // Funções de UI
    showLoading() {
        const button = document.querySelector('.complete-purchase-btn');
        if (button) {
            button.innerHTML = '⏳ Processando...';
            button.disabled = true;
        }
    }

    showError(message) {
        alert(message); // Substituir por modal mais elegante
    }

    // Configuração de validação adicional
    setupFormValidation() {
        // Implementar validações em tempo real
        document.addEventListener('input', (e) => {
            if (e.target.matches('#floating-email')) {
                this.validateEmailField(e.target);
            }
            if (e.target.matches('#floating-cpf')) {
                this.validateCpfField(e.target);
            }
        });
    }

    validateEmailField(field) {
        if (field.value && !this.validateEmail(field.value)) {
            field.style.borderColor = '#ff6b6b';
        } else {
            field.style.borderColor = '#4ecdc4';
        }
    }

    validateCpfField(field) {
        if (field.value && !this.validateCpf(field.value)) {
            field.style.borderColor = '#ff6b6b';
        } else {
            field.style.borderColor = '#4ecdc4';
        }
    }
}

// Inicializa o sistema quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutMobileBridge();
});

// Reinicializa se página for carregada via AJAX
document.addEventListener('updated_checkout', () => {
    new CheckoutMobileBridge();
});