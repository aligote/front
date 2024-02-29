<template lang="pug">
section.help-form 
    .container-lg.help__form-wrap
        form.row.help__form-content
            .col-12.help__form-block.mb-1
                h2.help__title.text-center Не нашли ответ на свой вопрос? 
                .help__subtitle Вы можете обратиться в техническую поддержку или написать нам на почту 
                    a.mail__to-link(href="mailto:help@burenavpn.com")  
                        |    help@burenavpn.com
            .col-md-6.mb-3
                input#email-help.form-control(type="email", name="email-help" placeholder="E-mail")
            .col-md-6.mb-3
                input#name-help.form-control(type="text", name="name-help" placeholder="Имя")
            .col-12.mb-4
                textarea.form-control(name="", cols="30", rows="3" placeholder="Вопрос")
            .col-12.mb-0.mb-md-5.text-center
                button.btn.btn-primary.send__help-form(type="button") Отправить

</template>