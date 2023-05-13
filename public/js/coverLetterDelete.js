document.getElementById('delete-button').addEventListener('click', function() {
    document.getElementById('confirmation-popup').style.display = 'block';
});

document.getElementById('confirm-delete').addEventListener('click', function() {
    
    document.getElementById('confirmation-popup').style.display = 'none';
});

document.getElementById('cancel-delete').addEventListener('click', function() {
    document.getElementById('confirmation-popup').style.display = 'none';
});
