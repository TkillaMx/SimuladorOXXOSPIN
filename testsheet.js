function showForm(formId) {
    // Ocultar todos los formularios
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => form.style.display = 'none');
    
    // Mostrar el formulario seleccionado
    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}
