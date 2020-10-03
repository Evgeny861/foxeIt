const team = () => {

    const evg = document.querySelector(".evgeny"),
        lev = document.querySelector(".lev"),
        shin = document.querySelector(".shingis"),
        nastya = document.querySelector(".anastasia"),
        teamPersones = document.querySelector('.team-persones'),
        body = document.querySelector('body');

        teamPersones.addEventListener('click', e => {
            if (e.target.closest('#evgeny')) {
                evg.style.display = "block"
            } else if (e.target.closest('#lev')) {
                lev.style.display = "block"
            } else if (e.target.closest('#anastasia')) {
                nastya.style.display = "block"
            } else if (e.target.closest('#shingis')) {
                shin.style.display = "block"
            }
        })
        body.addEventListener('click', e => {
            if (e.target.matches('.overlay')) {
                e.target.parentNode.style.display = "none";
            }
        })

}

export default team;