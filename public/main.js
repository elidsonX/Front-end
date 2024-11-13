document.addEventListener('DOMContentLoaded', initializePage);

function initializePage() {
    const currentPage = document.body.id;
    switch (currentPage) {
        case 'home':
            displayMenu();
            initializeCart();
            break;
        case 'dados':
            initializeDados();
            break;
        case 'cozinha':
        case 'motoboy':
        case 'entregue':
            displayPedidoInfo(currentPage);
            break;
        case 'adicionarProdutos':
            initializeAddProduct();
            break;
    }
}

function displayMenu() {
    const menuElement = document.getElementById('menu');
    if (!menuElement) return;

    const storedItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    console.log('Stored items:', storedItems);
    const menuItems = [...storedItems, ...window.menuItems];

    menuElement.innerHTML = '';

    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="${item.image || './assets/default-product-image.svg'}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>R$ ${parseFloat(item.price).toFixed(2)}</p>
            <button onclick="addToCart(${item.id})">Adicionar</button>
            <button onclick="deleteProduct(${item.id})" class="delete-btn">Deletar</button>
        `;
        menuElement.appendChild(itemElement);
    });
}

function initializeCart() {
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (window.cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
            return;
        }
        const total = window.cart.reduce((sum, item) => sum + item.price, 0);
        localStorage.setItem('pedidoTotal', total.toFixed(2));
        localStorage.setItem('itensPedido', JSON.stringify(window.cart.map(item => ({
            nome: item.name,
            preco: item.price
        }))));
        window.location.href = 'dados.html';
    });
}

function addToCart(itemId) {
    const menuItems = [...JSON.parse(localStorage.getItem('menuItems') || '[]'), ...window.menuItems];
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
        window.cart.push(item);
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    window.cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    document.getElementById('checkout-btn').textContent = `Finalizar Pedido - R$ ${total.toFixed(2)}`;
}

function initializeDados() {
    const form = document.getElementById('dadosForm');
    const totalSpan = document.getElementById('totalPedido');
    const itensList = document.getElementById('itensPedido');

    const total = localStorage.getItem('pedidoTotal') || '0.00';
    totalSpan.textContent = `R$${parseFloat(total).toFixed(2)}`;

    const itens = JSON.parse(localStorage.getItem('itensPedido')) || [];
    itens.forEach(item => {
        const li = document.createElement('li');
        const preco = item.preco ? parseFloat(item.preco).toFixed(2) : '0.00';
        li.textContent = `${item.nome || 'Item não informado'} - R$${preco}`;
        itensList.appendChild(li);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const endereco = document.getElementById('endereco').value;
        
        if (nome && endereco) {
            const pedido = {
                nomeCliente: nome,
                endereco: endereco,
                itens: itens,
                total: parseFloat(total)
            };

            enviarPedido(pedido);
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
}

function enviarPedido(pedido) {
    const pedidoDTO = {
        nomeCliente: pedido.nomeCliente,
        endereco: pedido.endereco,
        descricao: `Pedido de ${pedido.nomeCliente}`,
        valorTotal: pedido.total,
        itens: pedido.itens.map(item => ({
            nome: item.nome,
            preco: item.preco
        }))
    };
    console.log('Itens do pedido:', pedidoDTO.itens);
    fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(pedidoDTO)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Erro na resposta do servidor: ${response.status}. Detalhes: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Pedido criado:', data);
        localStorage.setItem('pedidoId', data.id);
        localStorage.setItem('pedidoNome', data.nomeCliente);
        localStorage.setItem('pedidoEndereco', data.endereco);
        localStorage.setItem('pedidoItens', JSON.stringify(data.itens || pedido.itens));
        localStorage.setItem('pedidoTotal', data.valorTotal || pedido.total);
        window.location.href = 'cozinha.html';
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar o pedido. Por favor, tente novamente. Detalhes: ' + error.message);
    });
}

function displayPedidoInfo(page) {
    const pedidoId = localStorage.getItem('pedidoId');
    const nomeCliente = localStorage.getItem('pedidoNome');
    const enderecoCliente = localStorage.getItem('pedidoEndereco');
    const itens = JSON.parse(localStorage.getItem('pedidoItens')) || [];
    const total = localStorage.getItem('pedidoTotal') || '0.00';

    if (pedidoId) {
        document.getElementById('nomeCliente').textContent = nomeCliente || 'Não informado';
        document.getElementById('enderecoCliente').textContent = enderecoCliente || 'Não informado';
        document.getElementById('totalPedido').textContent = `R$${parseFloat(total).toFixed(2)}`;

        const itensList = document.getElementById('itensPedido');
        if (itensList) {
            itensList.innerHTML = '';
            if (itens.length > 0) {
                itens.forEach(item => {
                    const preco = item.preco ? parseFloat(item.preco).toFixed(2) : '0.00';
                    const li = document.createElement('li');
                    li.textContent = `${item.nome || 'Item não informado'} - R$${preco}`;
                    itensList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'Itens não disponíveis';
                itensList.appendChild(li);
            }
        }
    } else {
        console.warn('Dados do pedido não encontrados no localStorage');
        window.location.href = 'index.html';
    }
}

function initializeAddProduct() {
    const form = document.getElementById('addProductForm');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput) {
        imageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('productName').value;
            const price = document.getElementById('productPrice').value;
            const imageFile = document.getElementById('productImage').files[0];

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const product = {
                        id: Date.now(),
                        name: name,
                        price: parseFloat(price),
                        image: e.target.result
                    };
                    addProduct(product);
                }
                reader.readAsDataURL(imageFile);
            } else {
                const product = {
                    id: Date.now(),
                    name: name,
                    price: parseFloat(price),
                    image: './assets/default-product-image.svg'
                };
                addProduct(product);
            }
        });
    } else {
        console.error('Formulário de adicionar produto não encontrado');
    }
}

function addProduct(product) {
    let products = JSON.parse(localStorage.getItem('menuItems')) || [];
    products.push(product);
    localStorage.setItem('menuItems', JSON.stringify(products));
    alert('Produto adicionado com sucesso!');
    window.location.href = 'index.html';
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
        let products = JSON.parse(localStorage.getItem('menuItems')) || [];
        products = products.filter(product => product.id !== productId);
        localStorage.setItem('menuItems', JSON.stringify(products));
        
        // Remover o produto dos itens predefinidos, se existir
        if (window.menuItems) {
            window.menuItems = window.menuItems.filter(item => item.id !== productId);
        }
        
        // Atualizar a exibição do menu
        displayMenu();
    }
}