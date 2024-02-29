<template lang="pug">
.container-fluid.bg-white     
    .container 
        nav.navbar.navbar-expand-md.bg-white.mp-1.pb-1 
            a.navbar-brand(href="/")
                    img(src="~/assets/img/logo.png", alt="", srcset="") 
                    span burena vpn
            button.navbar-toggler(type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation")
                img(src="~/assets/img/menu-gamb.png", alt="")
            .collapse.navbar-collapse#navbarSupportedContent
                ul.navbar-nav.mx-auto.menu 
                    li.nav-item.menu-item
                        a.nav-link(href="install.html") Как установить 
                    li.nav-item.menu-item
                        a.nav-link(href="index.html#principle") Принцип работы
                    li.nav-item.menu-item
                        a.nav-link(href="index.html#buy") Купить
                    li.nav-item.menu-item
                        a.nav-link(href="index.html#faq") FAQ
</template>