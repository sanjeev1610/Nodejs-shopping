var stripe = Stripe('pk_test_NIHAkbC4ME0LPYjj4qUjubVu000Lh4fPdf');
var elements = stripe.elements();
// Custom styling can be passed to options when creating an Element.
var style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      color: "#32325d",
    }
  };
  
  // Create an instance of the card Element.
  var card = elements.create('card', {style: style});
  
  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#card-element');


  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });


  var form = document.getElementById('checkout-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
  
    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server.
        stripeTokenHandler(result.token);
      }
    });
  });


  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('checkout-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
  
    // Submit the form
    form.submit();
  }
















//  Stripe('pk_test_NIHAkbC4ME0LPYjj4qUjubVu000Lh4fPdf');
// var elements = stripe.elements();

// $form = $('#checkout-form');

// $form.submit(function(event) {
//     $form.find('button').prop('disabled', true);

//     Stripe.card.createToken({
//         number: $('#card-number').val(),
//         cvc: $('#card-cvc').val(),
//         exp_month: $('#card-expiry-month').val(),
//         exp_year: $('#card-expiry-year').val(),
//         name: $('#card-name').val()
//     }, stripeResponseHandler);
//     return false;
// });

// function stripeResponseHandler(status, response) {

//     if(response.error) {
//         console.log("stripe error");
//         $('#charge-error').text(response.error.message);
//         $('#charge-error').removeClass('hidden');

//         $form.find('button'.prop('disabled',false));

//     }else {
//         //get the token id
//         var hiddenInput = document.createElement('input');
//         hiddenInput.setAttribute('type', 'hidden');
//         hiddenInput.setAttribute('name', 'stripeToken');
//         hiddenInput.setAttribute('value', response.token.id);
//         $form.appendChild(hiddenInput);
      
//         //submit form
//         $form.submit();
//     }

// }
