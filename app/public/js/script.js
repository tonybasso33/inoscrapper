window.onload=function() {
    PageState.init();
    const form = document.querySelector('#form');
    form.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(form);
        if (formData.get('url') === '' || formData.get('keywords') === '' || formData.get('maxPages') === '') {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        PageState.busy();
        console.log("Téléchargement du fichier CSV...");
        fetch('/', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.headers.get('Content-Type').includes('text/csv')) {
                return response.text();
            } else {
                PageState.idle();
                throw new Error('Le fichier téléchargé n\'est pas un fichier CSV.');
            }
        })
            .then(csvText => {
                // download csv
                console.log(csvText);
                const blob = new Blob([csvText], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'articles.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                PageState.idle();
            })
            .catch(error => {
                console.error('Erreur lors du téléchargement du fichier CSV:', error);
                PageState.idle();
            });
    });
}

class PageState {

    static button = null;
    static isBusy = false;

    static init() {
        this.button = document.querySelector('#submit');
        PageState.idle();
    }


    static busy() {
        if (!PageState.button.classList.contains('loading')) {
            PageState.button.classList.add('loading');
            this.isBusy = true;
        }
    }

    static idle() {
        if (PageState.button.classList.contains('loading')) {
            PageState.button.classList.remove('loading');
            this.isBusy = false;
        }

    }

}
