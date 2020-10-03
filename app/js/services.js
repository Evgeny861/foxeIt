const services = () => {
    const design = document.getElementById('design'),
        development = document.getElementById('development'),
        copyright = document.getElementById('copyright'),
        advertising = document.getElementById('advertising'),
        onlineBisnessMainText = document.querySelector('.online-bisness__main-text'),
        adv = document.querySelector('.adv'),
        copy = document.querySelector('.copy'),
        dev = document.querySelector('.dev'),
        des = document.querySelector('.des');

    design.addEventListener('click', () => {
        onlineBisnessMainText.style.display = "none"
        adv.style.display = "none"
        dev.style.display = "none"
        copy.style.display = "none"
        des.style.display = "block"
        development.style.color = "#fff"
        copyright.style.color = "#fff"
        advertising.style.color = "#fff"
        design.style.color = "#fba340"
    })
    development.addEventListener('click', () => {
        onlineBisnessMainText.style.display = "none"
        des.style.display = "none"
        adv.style.display = "none"
        copy.style.display = "none"
        dev.style.display = "block"
        design.style.color = "#fff"
        copyright.style.color = "#fff"
        advertising.style.color = "#fff"
        development.style.color = "#fba340"
    })
    copyright.addEventListener('click', () => {
        onlineBisnessMainText.style.display = "none"
        adv.style.display = "none"
        dev.style.display = "none"
        des.style.display = "none"
        copy.style.display = "block"
        design.style.color = "#fff"
        development.style.color = "#fff"
        advertising.style.color = "#fff"
        copyright.style.color = "#fba340"
    })
    advertising.addEventListener('click', () => {
        onlineBisnessMainText.style.display = "none"
        des.style.display = "none"
        dev.style.display = "none"
        copy.style.display = "none"
        adv.style.display = "block"
        design.style.color = "#fff"
        development.style.color = "#fff"
        copyright.style.color = "#fff"
        advertising.style.color = "#fba340"
    })
}

export default services;