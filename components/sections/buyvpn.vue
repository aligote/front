<template lang="pug">
section.buy__vpn#buy
    .container.text-center
        h2.text-uppercase.section__title.text-center  Купить vpn
    .container-lg
        form.row.need-validation.buy__vpn-form
            .form__content-block.d-flex.flex-column.col-md-8.offset-md-2.col-lg-5.offset-lg-0
                .email__input
                    label.form-label(for="email") Введите Ваш email
                    input#email.form-control(type="email", name="email" placeholder="name@example.com") 
                .select__period.d-flex.flex-wrap
                    .work__period Срок работы 
                    .select__period-items
                        .form-check 
                            input#1_month.form-check-input.d-none(type="radio", name="period" value="1")
                            label.form-check-label(for="1_month") 1 мес.
                        .form-check 
                            input#3_month.form-check-input.d-none(type="radio", name="period" value="3")
                            label.form-check-label(for="3_month") 3 мес.
                        .form-check 
                            input#6_month.form-check-input.d-none(type="radio", name="period" value="6")
                            label.form-check-label(for="6_month") 6 меc.
                        .form-check 
                            input#12_month.form-check-input.d-none(type="radio", name="period" value="12")
                            label.form-check-label(for="12_month") 12 мес. 
                .row
                    .col-md-8.mb-3.mb-md-0
                        label.form-label(for="") Локация
                        select.form-select.form-select-md(name="")
                            option(value="1") Латвия
                            option(value="2") Швеция 
                    .col-md-4.buy__q
                        label.form-label(for="") Кол-во 
                        .buy__q-block.d-flex 
                            button.buy__minus -
                            input#quantity.form-control.text-center.quantity__input(type="number", name="quantity" value="1" min="1" max="5")
                            button.buy__plus +
                .buy__promo.d-flex.flex-column.card
                    .input-group
                        input.form-control(type="text")
                        button.btn-secondary Промокод
                .summ__block.mb-3.mb-md-0 
                    | Итого : 
                    span 1500 руб
                .form-check
                    input.form-check-input(type="checkbox")
                    label.form-check-label Принимаю 
                        a(href="politica.html")  правила магазина
                .d-grid 
                    button.btn.btn-primary.form__btn-buyvpn(type="button") Купить vpn

</template>