function getApiBaseUrl() {
  if (location.host.startsWith('www')) {
    return 'https://api.ip6on.ly';
  } else if (location.host.startsWith('beta')) {
    return 'https://api-beta.ip6on.ly';
  } else {
    return 'https://api-dev.ip6on.ly';
  }
}

function screenshot(url) {
  document.getElementById('screenshot-container').style.display = 'none';
  document.getElementById('screenshot-loading').style.display = 'block';
  encodedUrl = encodeURIComponent(url);
  fetch(getApiBaseUrl() + '/v1/screenshot/' + encodedUrl + '?width=960&height=720').then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
        screenshotImg = document.getElementById('screenshot');
        screenshotImg.setAttribute('src', 'data:image/jpg;base64,' + data.image);
        screenshotImg.setAttribute('alt', 'Screenshot of ' + url);
        document.getElementById('screenshot-loading').style.display = 'none';
        document.getElementById('screenshot-container').style.display = 'block';
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });  
}

document.getElementById('submit').addEventListener('click', function(event) {
  event.preventDefault();
  screenshot(document.getElementById('protocol').value + document.getElementById('url').value);
});
