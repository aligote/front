<template lang="pug">
section.instructions
    .container.text-center
        h2.text-uppercase.section__title
            a(href="install.html") Инструкции по установке
    .container
        .row 
            .col-md-8.offset-md-2
                .instruction__block.d-flex.flex-column
                    form.instruction__form(action="#")
                        input#text__input.form-control.mb-3(type="text", name="text-input" placeholder="Введите текст")
                        input.form-control(type="submit", value="Поздороваться с коровкой")
                    .image 
                        img.img-fluid(src="~/assets/img/instruction/image.webp", alt="") 

</template>