let page = 1;
let fetching = false;
const container = document.getElementById('container');
console.log(container);
const cols = Array.from(container.getElementsByClassName('col'));
console.log(cols);

const fetchImageData = async() => {
    try {
        fetching = true;
        document.getElementById('loader').style.display = 'block';
        fetching = false;
        const response = await fetch(`https://dog.ceo/api/breeds/image/random/30`);
        const data = await response.json();
        fetching = false;
        return data.message;
    }catch (error) {
        console.log('Error fetching data ', error)
        fetching = false;
        throw error;
    };
}

    fetchImageData().then((images) => {
        if(images.length > 0){
            images.forEach((image, index) => {
                createCard(image, cols[index % cols.length]);

                console.log(index % cols.length);
            });
        }
        }).catch((error) => {
            console.error("Error initial fetch:", error);
        });

        const createCard =(image, col) => {
            const card = document.createElement('div');
            card.classList.add('card');
            const img = document.createElement('img');
            img.src = image;
            img.alt = 'Random Dog Image';
            img.style.width = "100%";
            img.onerror = function(){
                this.parentElement.style.display = 'none';
            };
            img.onload = function() {
                document.getElementById('loader').style.display = 'none';
            }
            card.appendChild(img);
            col.appendChild(card);
        };

        const handleScrool = () => {
            if(fetching) return;

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const bodyHeight = document.documentElement.scrollHeight;
            
            if(bodyHeight - scrollTop - windowHeight < 800){
                page++;
                fetchImageData().then((images) => {
                    if(images.length > 0) {
                        images.forEach((image, index) => {
                            createCard(image, cols[index % cols.length]);
                        });
                    }
                }).catch((error) => {
                    console.log('Error handling scroll ', error);
                });
            }
        };
        window.addEventListener('scroll', handleScrool);