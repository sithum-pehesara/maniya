document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // YouTube RSS to JSON API Endpoint (using rss2json as a free proxy)
    // ManiYa channel ID: UC04eK48-aQ5P_m91s03N20A
    const channelId = 'UC04eK48-aQ5P_m91s03N20A';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const videoContainer = document.getElementById('video-container');

    // Fetch Videos
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                videoContainer.innerHTML = ''; // Clear loader
                
                // Get the latest 2 videos
                const latestVideos = data.items.slice(0, 2);
                
                latestVideos.forEach(video => {
                    const videoDate = new Date(video.pubDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    // Create video card element
                    const card = document.createElement('a');
                    card.href = video.link;
                    card.target = '_blank';
                    card.className = 'video-card';
                    
                    // Generate high-res thumbnail URL instead of the default mqdefault
                    const hqThumbnail = video.thumbnail.replace('hqdefault', 'maxresdefault');

                    card.innerHTML = `
                        <img src="${hqThumbnail}" alt="${video.title}" class="video-thumbnail" onerror="this.src='${video.thumbnail}'">
                        <div class="video-info">
                            <h3 class="video-title">${video.title}</h3>
                            <p class="video-date"><i class="fa-regular fa-clock"></i> ${videoDate}</p>
                        </div>
                    `;
                    
                    videoContainer.appendChild(card);
                });
            } else {
                showError('Failed to load videos.');
            }
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
            showError('Unable to load latest content.');
        });

    function showError(message) {
        videoContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 30px; margin-bottom: 10px; color: var(--yt-color);"></i>
                <p>${message}</p>
                <p style="font-size: 14px; margin-top: 10px;">Check out <a href="https://www.youtube.com/@ManiYaOfficial" target="_blank" style="color: var(--secondary);">ManiYa on YouTube</a>.</p>
            </div>
        `;
    }
});
