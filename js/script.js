window.addEventListener('DOMContentLoaded', () => {
    //Tab
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');


    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active')
    }
    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i)
                }
            })
        }
    })
        //Timer
        const deadline = '2021-08-30';
        function getTimeRemaining(endtime) {
            const t = Date.parse(endtime) - Date.parse(new Date()),
                days = Math.floor((t / (1000 * 60 * 60 * 24))),
                hours = Math.floor((t / (1000 * 60 * 60) % 24)),
                minutes = Math.floor((t / (1000 * 60) % 60)),
                seconds = Math.floor((t / 1000) % 60);

            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            }
        }

        function getZero(num){
            if(num >= 0 && num < 10){
                return `0${num}`;
            }else{
                return num;
            }
        }
        function setClock(selector, endtime) {
            const timer = document.querySelector(selector),
                days = timer.querySelector('#days'),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(upDateClock, 1000);

            upDateClock();// убрать мигание при перезагрузке

           function upDateClock() {
                const t = getTimeRemaining(endtime);
                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);

                if (t.total <= 0) {
                    clearInterval(timeInterval);
                }
            }
        }

    setClock('.timer',deadline);

    //Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
          

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show'); 
        document.body.style.overflow = '';// чтобы  прокручивалось окно   
    }

    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';// чтобы не прокручивалось окно
        clearInterval(modalTimerId);
    }

     modalTrigger.forEach(btn =>{
        btn.addEventListener('click', openModal);
     })
     
    
    
// закрытие окна при нажатии на окно или на крестик
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == "") {
        closeModal();
    }
});
    document.addEventListener('keydown',(event)=>{
        if(event.code === "Escape"&& modal.classList.contains('show')){
            closeModal();
        }
    }) 
    const modalTimerId = setTimeout(openModal,15000);

    //открывает модал окно в конце скролла
    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll',showModalByScroll)
        }
    }
    window.addEventListener('scroll',showModalByScroll);

    //Создаем классы для карточек
    class MenuCard{
        constructor(src,alt,title,descr,price,parentSelector,...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.price = price;
            this.transfer = 27;
            this.changeToUAN();
        }
        changeToUAN() {
            this.price = this.price * this.transfer;//конвертация валют
        }

        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element)
            }else{
                this.classes.forEach(ClassName =>element.classList.add(ClassName));//перебираем ...classes
            }
            
            element.innerHTML = `   
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>  
            `;
            this.parent.append(element);
        }
    }

    const getResourse = async(url) =>{
        const res =  await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch : ${url},status ${res.status}`);
        }

        return await res.json();
    };

    /*getResourse('http://localhost:3000/menu')
       .then(data =>{
           data.forEach(({img,altimg,title,descr,price}) =>{//деструктурируем obj
               new MenuCard(img,altimg,title,descr,price, '.menu .container').render();
           });
       });*/
       getResourse('http://localhost:3000/menu') 
       .then(data => createCard(data));//получаем массив  из db.json

       function createCard(data){
           data.forEach(({img,altimg,title,descr,price}) =>{//перебираем и деструктурируем
               const element = document.createElement('div');//создаем блок

               element.classList.add('menu__item');//добавляем класс

               element.innerHTML = `
               <img src=${img} alt=${altimg}>
                  <h3 class="menu__item-subtitle">${title}</h3>
                  <div class="menu__item-descr">${descr}</div>
                  <div class="menu__item-divider"></div>
                  <div class="menu__item-price">
                      <div class="menu__item-cost">Цена:</div>
                      <div class="menu__item-total"><span>${price}</span> грн/день</div>
                  </div>  
               `;
               document.querySelector('.menu .container').append(element);//добавляем на страницу
           });
       }

   
  
     
     //Forms

     const forms = document.querySelectorAll('form');

     const message = {
         loading:'img/form/spinner.svg',
         success:'Спасибо.Мы с вами свяжемся.',
         failure:'Что-то пошло не так ...'
     };

     forms.forEach(item =>{
         bindPostData(item);
     })
    // async - говорит что в ф-и асинхронный код
     //await - говорит что надо дождаться ответа 
     const postData = async(url,data) =>{
         const res =  await fetch(url, {
            method:"POST",
            headers:{
               'Content-type':'application/json'
            },
            body:data
         });

         return await res.json();
     };

     function bindPostData(form){
         form.addEventListener('submit', (e) =>{

             //отмена перезагрузки браузера
             e.preventDefault();

             const statusMessage = document.createElement('img');// создаем элемент
             statusMessage.src = message.loading;// добавляем класс
             statusMessage.style.cssText =`
                 display:block;
                 margin:0 auto;
             `;
             //form.append(statusMessage); //  добавляем в index.html
             form.insertAdjacentElement('afterend',statusMessage);

            
             //при связке XMLHttpRequest и formData заголовок не нужен
             
             const formData = new FormData(form);
             // в index.html  в данных всегда должен быть указан атрибут "name"

            const json = JSON.stringify(Object.fromEntries(formData.entries()));        

            postData('http://localhost:3000/requests',json)    
            
            .then(data =>{
                console.log(data);
                showThanksModal(message.success) ;
                statusMessage.remove();
                form.reset(); //очистка формы
            }).catch(() =>{
                showThanksModal(message.failure) ; 
            }).finally(() =>{
                form.reset(); //очистка формы    
            });
          
         });
     }

     function showThanksModal(message){
         const prevModalDialog = document.querySelector('.modal__dialog');

         //убираем модальное окно
         prevModalDialog.classList.add('hide');
         openModal();

         const thanksModal = document.createElement('div');
         thanksModal.classList.add('modal__dialog');
         thanksModal.innerHTML = `
             <div class="modal__content">
                 <div class="modal__close" data-close="" class="modal__close">×</div>
                 <div class="modal__title">${message}</div>
             </div>
         `;

         document.querySelector('.modal').append(thanksModal);
         setTimeout(() =>{
             thanksModal.remove();
             prevModalDialog.classList.add('show');
             prevModalDialog.classList.remove('hide');
             closeModal();

         },4000);

     }

     /*fetch('db.json')//получаем обьект
         .then(data =>data.json())
         .then(res =>console.log(res));*/

    // открываем через json-server     

      fetch('http://localhost:3000/menu')//получаем массив
         .then(data =>data.json())
         .then(res =>console.log(res)); 

     



     

});