<template lang="pug">
section.faq#faq
    .container.text-center
        h2.text-uppercase.section__title Ответы на вопросы
    .container
        #faq__block.row.accordion.faq__block
            .accordion-item.faq__item
                .accordion-header.faq__question
                button.accordion-button(type='button', data-bs-toggle='collapse', data-bs-target='#item_1', aria-expanded='true', aria-controls='item_1')
                    | Для чего нужен vpn?
                |     
                #item_1.accordion-collapse.collapse.faq__answer(data-bs-parent='#faq__block')
                    .accordion-body.faq__answer
                            | VPN - virtual private network нужен для многих целей. В частности, vpn используют для обхода
                            | блокировок. Бурена VPN использует протокол wireguard. Этот протокол с открытым исходным
                            | кодом, самый современный, энергоэффективный и быстрый. Вы устанавливаете
                            | только нативное приложение wireguard для использования впн и больше ничего. Вы получаете
                            | удобный и быстрый впн, который включается за секунду.
            .accordion-item.faq__item
                .accordion-header.faq__question
                button.accordion-button.collapsed(type='button', data-bs-toggle='collapse', data-bs-target='#item_2', aria-expanded='false', aria-controls='item_2')
                    | Чем ваше решение отличается от NordVPN, ExpressVpn, ProtonVpn и
                    | других?    
                #item_2.accordion-collapse.collapse(data-bs-parent='#faq__block')
                    .accordion-body.faq__answer
                            | VPN - virtual private network нужен для многих целей. В частности, vpn используют для обхода
                            | блокировок. Бурена VPN использует протокол wireguard. Этот протокол с открытым исходным
                            | кодом, самый современный, энергоэффективный и быстрый. Вы устанавливаете
                            | только нативное приложение wireguard для использования впн и больше ничего. Вы получаете
                            | удобный и быстрый впн, который включается за секунду.
            .accordion-item.faq__item
                .accordion-header.faq__question
                button.accordion-button.collapsed(type='button', data-bs-toggle='collapse', data-bs-target='#item_3', aria-expanded='false', aria-controls='item_3')
                    | Какие устройства поддерживаются?  
                #item_3.accordion-collapse.collapse(data-bs-parent='#faq__block')
                    .accordion-body.faq__answer
                            | VPN - virtual private network нужен для многих целей. В частности, vpn используют для обхода
                            | блокировок. Бурена VPN использует протокол wireguard. Этот протокол с открытым исходным
                            | кодом, самый современный, энергоэффективный и быстрый. Вы устанавливаете
                            | только нативное приложение wireguard для использования впн и больше ничего. Вы получаете
                            | удобный и быстрый впн, который включается за секунду.
            .accordion-item.faq__item
                .accordion-header.faq__question
                button.accordion-button.collapsed(type='button', data-bs-toggle='collapse', data-bs-target='#item_4', aria-expanded='false', aria-controls='item_4')
                    | Могу ли я использовать один конфиг файл на разных устройствах?   
                #item_4.accordion-collapse.collapse(data-bs-parent='#faq__block')
                    .accordion-body.faq__answer
                            | VPN - virtual private network нужен для многих целей. В частности, vpn используют для обхода
                            | блокировок. Бурена VPN использует протокол wireguard. Этот протокол с открытым исходным
                            | кодом, самый современный, энергоэффективный и быстрый. Вы устанавливаете
                            | только нативное приложение wireguard для использования впн и больше ничего. Вы получаете
                            | удобный и быстрый впн, который включается за секунду.
            .accordion-item.faq__item
                .accordion-header.faq__question
                button.accordion-button.collapsed(type='button', data-bs-toggle='collapse', data-bs-target='#item_5', aria-expanded='false', aria-controls='item_5')
                    | Где гарантия, что после оплаты впн будет работать указанное время?    
                #item_5.accordion-collapse.collapse(data-bs-parent='#faq__block')
                    .accordion-body.faq__answer
                            | VPN - virtual private network нужен для многих целей. В частности, vpn используют для обхода
                            | блокировок. Бурена VPN использует протокол wireguard. Этот протокол с открытым исходным
                            | кодом, самый современный, энергоэффективный и быстрый. Вы устанавливаете
                            | только нативное приложение wireguard для использования впн и больше ничего. Вы получаете
                            | удобный и быстрый впн, который включается за секунду.
            .accordion-item.faq__item
                .accordion-header.faq__question
                button.accordion-button.collapsed(type='button', data-bs-toggle='collapse', data-bs-target='#item_6', aria-expanded='false', aria-controls='item_6')
                    | В чем разница между серверами в латвии и швеции?    
                #item_6.accordion-collapse.collapse(data-bs-parent='#faq__block')
                    .accordion-body.faq__answer
                            | VPN - virtual private network нужен для многих целей. В частности, vpn используют для обхода
                            | блокировок. Бурена VPN использует протокол wireguard. Этот протокол с открытым исходным
                            | кодом, самый современный, энергоэффективный и быстрый. Вы устанавливаете
                            | только нативное приложение wireguard для использования впн и больше ничего. Вы получаете
                            | удобный и быстрый впн, который включается за секунду.
            .accordion-item.faq__item
                .accordion-header.faq__question
                button.accordion-button.collapsed(type='button', data-bs-toggle='collapse', data-bs-target='#item_7', aria-expanded='false', aria-controls='item_7')
                    | Есть ли у вас ограничения на доступ к сайтам?   
                #item_7.accordion-collapse.collapse(data-bs-parent='#faq__block')
                    .accordion-body.faq__answer
                            | VPN - virtual private network нужен для многих целей. В частности, vpn используют для обхода
                            | блокировок. Бурена VPN использует протокол wireguard. Этот протокол с открытым исходным
                            | кодом, самый современный, энергоэффективный и быстрый. Вы устанавливаете
                            | только нативное приложение wireguard для использования впн и больше ничего. Вы получаете
                            | удобный и быстрый впн, который включается за секунду.

</template>