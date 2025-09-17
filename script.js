const container = document.getElementById('tracksContainer');
const statsContainer = document.getElementById('statsContainer');

async function fetchData() {
    const response = await fetch('https://kitek.ktkv.dev/songs.json');
    const tracks = await response.json();

    let totalDurationMs = 0;
    let totalPopularity = 0;
    let popularityCount = 0;

    container.innerHTML = ''; 

    tracks.forEach(function(item, index) {
        let durationMs = 0;
        if (item.duration_ms) {
            durationMs = item.duration_ms;
        } else if (item.track && item.track.duration_ms) {
            durationMs = item.track.duration_ms;
        }
        totalDurationMs += durationMs;

        let popularity = null;
        if (item.popularity !== undefined) {
            popularity = item.popularity;
        } else if (item.track && item.track.popularity !== undefined) {
            popularity = item.track.popularity;
        }
        if (popularity !== null) {
            totalPopularity += popularity;
            popularityCount++;
        }

        const li = document.createElement('li');
        li.classList.add('track-item');

        const numberDiv = document.createElement('div');
        numberDiv.classList.add('track-number');
        numberDiv.textContent = index + 1;

        const mainDiv = document.createElement('div');
        mainDiv.classList.add('track-main');

        const image = document.createElement('img');
        image.classList.add('album-art');
        if (item.track && item.track.album && Array.isArray(item.track.album.images) && item.track.album.images[1]) {
            image.src = item.track.album.images[1].url;
            image.alt = item.name || 'Альбом';
        } else {
            image.alt = 'Без обложки';
            image.src = 'https://via.placeholder.com/64?text=No+Image'; 
        }

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('track-info');

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('track-name');
        nameDiv.textContent = item.name || (item.track ? item.track.name : 'Неизвестно');

        const artistDiv = document.createElement('div');
        artistDiv.classList.add('track-artists');
        let artists = [];
        if (item.album && item.album.artists) {
            artists = item.album.artists;
        } else if (item.artists) {
            artists = item.artists;
        } else if (item.track && item.track.artists) {
            artists = item.track.artists;
        }
        artistDiv.textContent = artists.length > 0 ? artists.map(a => a.name).join(', ') : 'Неизвестный исполнитель';

        const albumDiv = document.createElement('div');
        albumDiv.classList.add('track-album');
        albumDiv.textContent = (item.album && item.album.name) || (item.track && item.track.album && item.track.album.name) || 'Неизвестный альбом';

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(artistDiv);
        infoDiv.appendChild(albumDiv);

        mainDiv.appendChild(image);
        mainDiv.appendChild(infoDiv);

        const metaDiv = document.createElement('div');
        metaDiv.classList.add('track-meta');

        const durationDiv = document.createElement('div');
        durationDiv.classList.add('duration');
        durationDiv.textContent = formatTrackDuration(durationMs);

        metaDiv.appendChild(durationDiv);

        if (popularity !== null) {
            const popularityDiv = document.createElement('div');
            popularityDiv.classList.add('popularity');
            popularityDiv.textContent = '♪ ' + popularity;
            metaDiv.appendChild(popularityDiv);
        }

        li.appendChild(numberDiv);
        li.appendChild(mainDiv);
        li.appendChild(metaDiv);

        container.appendChild(li);
    });


    const infoContainer = document.getElementById('statsContainer');
if (infoContainer) {
    infoContainer.innerHTML = `
        <p>Всего треков: ${tracks.length}</p>
        <p>Общая длительность: ${formatTotalDuration(totalDurationMs)}</p>
    `;
}
}


function formatTrackDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatTotalDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours > 0 ? hours + 'ч ' : ''}${minutes}м`;
}


fetchData();