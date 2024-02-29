<template lang="pug">
section.principle#principle
    .container.text-center
        h2.text-uppercase.section__title.text-center  Принцип работы
    .container-fluid.container-xxl
        .row.justify-content-evenly.align-items-center.g-xl-0.flex-column.flex-xl-row.gy-4.principle__content
            .col-auto 
                .principle__user
                    .principle__user-icon 
                        picture 
                            source(media="(max-width: 1200px )", srcset="~/assets/img/principle/small-person.svg", sizes="")
                            img(src="~/assets/img/principle/user.svg", alt="")
                .principle__user-text Пользователь
            .col-auto.d-inline-flex 
                .priciple__arrow 
                    img(src="~/assets/img/principle/arrow.svg", alt="")
            .col-auto 
                .principle__wire 
                    img(src="~/assets/img/principle/wg.svg", alt="")
            .col-auto 
                .principle__obf.d-none.d-xl-block
                    img(src="~/assets/img/principle/eu.svg", alt="")
            .col-auto
                .principle__obf.d-xl-none 
                    img(src="~/assets/img/principle/eu2.svg", alt="")
            .col-auto 
                .principle__mem
                    img(src="~/assets/img/principle/free.svg", alt="")
</template>