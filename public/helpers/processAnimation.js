let processAnimation = {
    init: function () {
        let submitBtn = document.getElementById('submit-button');
        submitBtn.addEventListener('click', this.startProcessingAnimation);
    },
    startProcessingAnimation: function () {
        document.getElementById('circularG').style.display = 'inline-block';
    },
    stopProcessingAnimation: function () {
        document.getElementById('circularG').style.display = 'none';
    }
}