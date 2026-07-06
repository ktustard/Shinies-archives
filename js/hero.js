const counters = document.querySelectorAll(".counter");

const speed = 80;

const animateCounters = () => {

    counters.forEach(counter=>{

        const target = +counter.dataset.target;

        const update = ()=>{

            const current = +counter.innerText;

            const increment = Math.ceil(target/speed);

            if(current < target){

                counter.innerText = current + increment;

                requestAnimationFrame(update);

            }else{

                counter.innerText = target;

            }

        }

        update();

    });

}

window.addEventListener("load",animateCounters);