//slider
const slider = document.querySelector('.img_carousel');
const flkty = new Flickity(slider, {
    cellAlign: 'center',
    contain: true,
    imagesLoaded: true,
    autoPlay: 4000,
    wrapAround: true,
    friction: 0.40
});


let cart_list = [];
const cartVisible = () => {

    const empty = document.querySelector(".empty_cart");
    const cart = document.querySelector(".cart");
    if (cart_list.length == 0) {
        empty.style.visibility = "visible";
        cart.style.visibility = "hidden";
    }
    else {
        empty.style.visibility = "hidden";
        cart.style.visibility = "visible";
    }
}

const cartUnvisible = () => {
    document.querySelector(".empty_cart").style.visibility = "hidden";
    document.querySelector(".cart").style.visibility = "hidden";
}

document.querySelector(".shop-icon").addEventListener("click", (e) => {
    const cart = document.querySelector('.cart')
    const empty = document.querySelector(".empty_cart")

    if (cart.style.visibility == "visible" || empty.style.visibility == "visible")
        cartUnvisible()
    else cartVisible();
})

const calculateTotal = () => {
    let res = 0;
    if (cart_list == null) {
        res = 0;
    }
    else
        cart_list.forEach((el) => {
            res += +el.price * +el.quantity
        })
    document.querySelector(".total-value").textContent = res.toFixed(2) + "$";
}

const cartUpdate = () => {
    const empty = document.querySelector(".empty_cart");
    const cart = document.querySelector(".cart");

    calculateTotal();
    if (cart.style.visibility == "visible" || empty.style.visibility == "visible")
        cartVisible();
}
const setDefaultStoreButton = (name) => {
    const cards = document.querySelectorAll('.store-card');
    cards.forEach((e) => {
        const item_name = e.querySelector(".item-name");
        if (item_name && item_name.textContent == name.textContent) {
            const button = e.querySelector("button");
            button.textContent = "Buy"
            button.className = "buy-button orange_button";
        }
    })
}
document.querySelector(".cart-clear-button").addEventListener("click", (e) => {
    e.target.parentNode.parentNode.querySelectorAll(".cart-item-container").forEach(e => e.remove());
    cart_list = [];
    cartUpdate();
    document.querySelectorAll(".item-name").forEach(e => setDefaultStoreButton(e));
})

document.querySelector(".empty_cart").addEventListener("click", (e) => {
    e.target.style.visibility = "hidden";
})

const deleteFromCartByName = (name) => {
    setDefaultStoreButton(name);

    cart_list = cart_list.reduce((acc, item) => {
        if (item.name.textContent != name.textContent)
            acc.push(item);
        return acc;
    }, [])
    cartUpdate();
}

class StoreCard {
    constructor(itemName, className, imageSrcLink, price) {
        this.card = {};
        this.ImageInit(imageSrcLink);
        this.ItemNameInit(itemName);
        this.CardInit(className);
        this.card.price = price;
        this.PriceItemInit(price);
        this.BuyButtonInit();
        this.AppendAll();
    }
    AppendAll() {
        this.card.container.append(this.card.image);
        this.card.container.append(this.card.name);
        this.card.container.append(this.card.priceItem);
        this.card.container.append(this.card.button);
        document.querySelector('.items').append(this.card.container);

    }
    BuyButtonInit() {
        this.card.button = document.createElement("button");
        this.card.button.textContent = "Buy";
        this.card.button.className = "orange_button buy-button"

        const error = document.querySelector('.error-unlogined');
        error.addEventListener("click", () => {
            error.style.visibility = "hidden";
        })

        this.card.button.addEventListener("click", (e) => {
            if (currentUser) {
                if (e.target.textContent == "Buy") {
                    cart_list.push(new CartItem(
                        e.target.parentNode.querySelector('img').src,
                        e.target.parentNode.querySelector(".item-name").textContent,
                        1,
                        Number.parseFloat(e.target.parentNode.querySelector('.item-price').textContent))
                    );
                    e.target.textContent = "Added to a cart";
                    e.target.className = "buy-button transparent_button";

                }
                else {
                    e.target.textContent = "Buy"
                    e.target.className = "buy-button orange_button";

                    let item_name = e.target.parentNode.querySelector(".item-name");
                    deleteFromCartByName(item_name);
                    cart_list.forEach(e => {

                        if (e.name == item_name.textContent) e.remove();
                    })
                    document.querySelectorAll(".cart-item-container").forEach((el) => {
                        if (el.querySelector('.cart-item-name').textContent == item_name.textContent) el.remove();
                    })

                }
            }
            else {
                error.style.visibility = 'visible';
                setTimeout(() => {
                    error.style.visibility = "hidden";
                }, 1500)

            }
            cartUpdate();
        });

    }


    PriceItemInit(price) {
        this.card.priceItem = document.createElement("div");
        this.card.priceItem.className = "item-price"
        this.card.priceItem.textContent = price + ' $';
    }
    CardInit(className) {
        this.card.container = document.createElement("div");
        this.card.container.classList.add("store-card", className);
    }

    ItemNameInit(itemName) {
        this.card.name = document.createElement("div");
        this.card.name.textContent = itemName;
        this.card.name.classList.add("item-name")
    }

    ImageInit(src) {
        this.card.image = document.createElement("img");
        this.card.image.id = "card-image"
        this.card.image.src = src;
    }

}

class CartItem {
    constructor(imageSrcLink, itemName, quantity, price) {
        this.quantity = quantity;
        this.price = price;

        this.ImageInit(imageSrcLink);
        this.ItemNameInit(itemName);
        this.PriceItemInit();
        this.TotalItemInit();
        this.ButtonsItemInit();
        this.AppendAll();
    }
    ButtonsItemInit() {
        this.decrease_button = document.createElement("div");
        this.decrease_button.className = 'cart-decrease-button transparent_button';
        this.decrease_button.textContent = "<";
        this.decrease_button.addEventListener("click", (e) => {
            if (this.quantity > 1) {
                this.quantity--;
                let total_item = e.target.parentNode.parentNode.querySelector('.item-total')
                let price_item = e.target.parentNode.parentNode.querySelector(".cart-item-price");
                total_item.textContent = "=" + +(this.price * this.quantity).toFixed(2) + "$";
                price_item.textContent = this.price + '$x' + this.quantity;
            }
            else {
                console.log(e.currentTarget.parentNode.parentNode.querySelector(".cart-item-name"))
                deleteFromCartByName(e.currentTarget.parentNode.parentNode.querySelector(".cart-item-name"))
                e.currentTarget.parentNode.parentNode.remove();
            }
            cartUpdate();
        })

        this.increase_button = document.createElement("div");
        this.increase_button.className = 'cart-increase-button transparent_button';
        this.increase_button.textContent = ">";
        this.increase_button.addEventListener("click", (e) => {
            this.quantity++;
            let total_item = e.target.parentNode.parentNode.querySelector('.item-total')
            let price_item = e.target.parentNode.parentNode.querySelector(".cart-item-price");

            total_item.textContent = "=" + +(this.price * this.quantity).toFixed(2) + "$";
            price_item.textContent = this.price + '$x' + this.quantity;
            cartUpdate();
        });

        this.delete_button = document.createElement("div");
        this.delete_button.className = "cart-delete-button transparent_button";
        this.delete_button.textContent = "x"
        this.delete_button.addEventListener("click", (e) => {
            deleteFromCartByName(e.target.parentNode.parentNode.querySelector(".cart-item-name"));
            e.currentTarget.parentNode.parentNode.remove();
            cartUpdate();
        })

        this.buttons = document.createElement("div");
        this.buttons.className = "item-buttons"
        this.buttons.append(this.decrease_button);
        this.buttons.append(this.increase_button);
        this.buttons.append(this.delete_button)

    }

    TotalItemInit() {
        this.totalItem = document.createElement("div");
        this.totalItem.classList = "item-total";
        this.totalItem.textContent = "=" + +(this.price * this.quantity) + "$";
    }
    AppendAll() {
        this.container = document.createElement("div")
        this.container.className = "cart-item-container";
        this.container.append(this.image);
        this.container.append(this.name);
        this.container.append(this.priceItem);
        this.container.append(this.totalItem);
        this.container.append(this.buttons);
        document.querySelector('.cart-list').append(this.container);

    }

    PriceItemInit() {
        this.priceItem = document.createElement("div");
        this.priceItem.className = "cart-item-price"
        this.priceItem.textContent = this.price + '$x' + this.quantity;
    }

    ItemNameInit(itemName) {
        this.name = document.createElement("div");
        this.name.textContent = itemName;
        this.name.classList.add("cart-item-name")
    }

    ImageInit(src) {
        this.image = document.createElement("img");
        this.image.id = "cart-item-image"
        this.image.src = src;
    }

}
document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('logout_button')) {
        document.querySelectorAll(".cart-item-container").forEach(e => {
            deleteFromCartByName(e.querySelector(".cart-item-name"));
            e.remove();
        });
        cart_list = [];
        cartUnvisible();
        calculateTotal();
    }
});


let cards = [new StoreCard("Bag", 'bag', 'src/img/merch/bag.png', 49.99),
new StoreCard("Hat blue", 'hat-blue', 'src/img/merch/hat blue.png', 20.00),
new StoreCard("Hat orange", "hat-orange", 'src/img/merch/hat orange.png', 20.00),
new StoreCard("Hat red", "hat-red", 'src/img/merch/hat red.png', 20.00),
new StoreCard("Hat white", "hat-white", 'src/img/merch/hat white.png', 20.00),
new StoreCard("Hat black", "hat-black", 'src/img/merch/hat black.png', 20.00),
new StoreCard("Hoodie blue", "hoodie-blue", 'src/img/merch/hoodie blue.png', 40.00),
new StoreCard("Hoodie dark", "hoodie-dark", 'src/img/merch/hoodie dark.png', 40.00),
new StoreCard("Hoodie", "hoodie-", 'src/img/merch/hoodie.png', 40.00),
new StoreCard("Mug white", 'mug-white', 'src/img/merch/mug white.png', 10.00),
new StoreCard("Mug yellow", 'mug-yellow', 'src/img/merch/mug yellow.png', 10.00),
new StoreCard("Food package", 'food-package', 'src/img/merch/package.png', 1.00),
new StoreCard("T-shirt oversize black", 't-shirt-black', 'src/img/merch/T-shirt oversize black.png', 15.00),
new StoreCard("T-shirt oversize blue", 't-shirt-blue', 'src/img/merch/T-shirt oversize blue.png', 15.00),
new StoreCard("T-shirt oversize green", 't-shirt-green', 'src/img/merch/T-shirt oversize green.png', 15.00),
new StoreCard("T-shirt oversize yellow", 't-shirt-yellow', 'src/img/merch/T-shirt oversize yellow.png', 15.00),
new StoreCard("T-shirt oversize red", 't-shirt-red', 'src/img/merch/T-shirt oversize red.png', 15.00),

];