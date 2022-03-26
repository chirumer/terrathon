window.addEventListener("load", myMain, false);

function myMain() {
    run();
}

async function run() {

    const cells = document.getElementsByClassName('itemdeatils');

    let products = []

    for (const cell of cells) {

        const product_name = cell.querySelector('.product-name').textContent;

        const product = {
            'element': cell,
            'name': product_name
        };

        products.push(product);
    }

    const textfile_url = chrome.runtime.getURL('data/links.txt');
    const response = await fetch(textfile_url);
    const text = await response.text();

    const sentences = text.split('\n');

    let sustainable_products = []

    for (const sentence of sentences) {
        const prod_name = sentence.split('`')[0];
        const prod_link = sentence.split('`')[1];

        sustainable_products.push({
            'name': prod_name,
            'link': prod_link
        });
    }


    function product_match(x, y) {

        no_matching = 0;

        for (let word of x.split(/\s+/)) {
            word = word.trim();
            if (!word) {
                continue;
            }

            for (let word2 of y.split(/\s+/)) {
                word2 = word2.trim();
                if (!word2) {
                    continue;
                }

                if (word == word2) {

                    if (!(/^[A-Za-z]*$/.test(word))) {
                        continue;
                    }

                    no_matching++;
                }
            }
        }

        return no_matching;
    }


    for (const product of products) {
        for (const s_product of sustainable_products) {

            if (product_match(product.name, s_product.name) > 1) {
                const btn = document.createElement("button");
                btn.textContent = 'Sustainable Alternative';
                btn.style['position'] = 'absolute';
                btn.classList.add('alternative_button');
                btn.role = 'button';
                btn.style['width'] = '100%';
                btn.style['z-index'] = '1000';
                btn.style['left'] = '0px';
                btn.style['top'] = '0px';
                btn.addEventListener('click', () => {
                    window.location.replace(s_product.link);
                })
                product.element.appendChild(btn);
            }
        }
    }
}

const sheet = (function() {
	const style = document.createElement("style");
	document.head.appendChild(style);

	return style.sheet;
})();

const my_timer = setInterval(run, 500);