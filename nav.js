document.addEventListener('DOMContentLoaded', function() {
    // Sembunyikan semua menu dropdown saat halaman dimuat untuk mencegah bug tampilan
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            const parentLi = this.closest('li.dropdown');
            const dropdownMenu = parentLi.querySelector('.dropdown-menu');
            
            // Tutup semua dropdown lain
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.style.display = 'none';
                    menu.closest('li.dropdown').classList.remove('active');
                }
            });

            // Toggle dropdown yang diklik
            dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
            parentLi.classList.toggle('active');
        });
    });

    // Menutup dropdown saat klik di luar menu
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
                menu.closest('li.dropdown').classList.remove('active');
            });
        }
    });
});