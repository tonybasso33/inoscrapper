window.onload=function() {

    PageState.init();
    const form = document.querySelector('#form');

    form.addEventListener('submit', event => {
        event.preventDefault();

        // create data object
        const data = {
            url: form.elements.url.value,
            keywords: form.elements.keywords.value.split(',').map(keyword => keyword.trim()),
            maxPages: parseInt(form.elements.maxPages.value)
        };


        // get form data & check if all fields are filled
        if (data.url === '' || data.keywords === '' || data.maxPages === '') {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        PageState.busy();
        fetch('/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }).then(response => {
            // response is a csv, return text
            if (response.headers.get('Content-Type').includes('text/csv')) {
                return response.text();
            } else {
                throw new Error('Le fichier téléchargé n\'est pas un fichier CSV.');
            }
        })
            //get csv from Response object
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
                displayCsv(csvText);
                PageState.idle();
            })

            //when error downloading csv
            .catch(error => {
                console.error('Erreur lors du téléchargement du fichier CSV:', error);
                PageState.idle();
            });
    });
}

function parseCsv(text) {
    const rows = text.trim().split('\n');
    const headers = rows.shift().split(',');
    return rows.map(row => {
        const cells = row.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = cells[index].trim();
            return obj;
        }, {});
    });
}

function displayCsv(csvText) {
    const data = parseCsv(csvText);
    const table = document.querySelector('.csv-table tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        const titleTd = document.createElement('td');
        const contentTd = document.createElement('td');
        const sentimentTd = document.createElement('td');

        sentimentTd.classList.add('csv-sentiment');

        titleTd.textContent = row.title;
        contentTd.textContent = row.content;
        sentimentTd.textContent = row.sentiment;

        tr.appendChild(titleTd);
        tr.appendChild(contentTd);
        tr.appendChild(sentimentTd);
        table.appendChild(tr);

        tr.addEventListener('click', () => {
            window.open(row.link);
        });
    });

    const results = document.querySelector('#results');
    results.classList.remove('hide-results');
    results.scrollIntoView();
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
