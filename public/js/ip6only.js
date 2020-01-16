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
  document.getElementById('error-message').style.display = 'none';
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
      response.json().then(function(json) {
        console.log(json);
        document.getElementById('screenshot-loading').style.display = 'none';

        if (json.errors) {
          let errorMessage = '';
          if (json.errors.length === 1) {
            errorMessage = '<strong>Error:</strong> ' + json.errors[0];
          } else {
            errorMessage = '<strong>Errors:</strong><ul>';
            for (let i = 0; i < json.errors.length; i++) {
              errorMessage += '<li>' + json.errors[i] + '</li>';
            }
            errorMessage += '</ul>';
          }
          document.getElementById('error-message').innerHTML = errorMessage;
          document.getElementById('error-message').style.display = 'block';
        } else {
          screenshotImg = document.getElementById('screenshot');
          screenshotImg.setAttribute('src', 'data:image/jpg;base64,' + json.image);
          screenshotImg.setAttribute('alt', 'Screenshot of ' + url);
          document.getElementById('screenshot-container').style.display = 'block';
        }
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
