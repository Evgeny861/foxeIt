const problem = () => {

    const problem = document.getElementById('problem'),
    problemImg = document.getElementById('problem-img');

    problem.addEventListener('click', e => {

        if (e.target.dataset.src) {
            problemImg.src = e.target.dataset.src
        }
        
    })
}

export default problem;