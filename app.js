$(document).ready(function() {

  /*
   *  declare/initializa variables
   */

  var itemTemplate = $('#templates .item'),
      list         = $('#list'),
      url          = 'https://listalous.herokuapp.com/lists/mizzario/';

  /*
   *  helper methods
   */

  function addItemToPage(itemData) {
    var item = itemTemplate.clone();
    item.attr('data-id',itemData.id);
    item.find('.description').text(itemData.description);
    if(itemData.completed) {
      item.addClass('completed');
    }
    list.append(item);
  }

  /*
   *  api calls
   */

  // api call to get list items
  function getListRequest() {
    $.get(url, function(data) {
      var items = data.items;

      // loop through items and append to list for display
      items.forEach(function(item) {
        addItemToPage(item);
      });
    });
  }

  // api call to add new item
  function addNewItemRequest(descriptionData) {
    $.post(url+'items', { description: descriptionData, completed: false }, function(data) {

      // after successful request, add new item to list
      addItemToPage(data);
    });
  }


  /*
   *  event handlers
   */

  $(document).on('submit','#add-form',function(event) {
    // cancel submission process
    event.preventDefault();
    // save text from input field
    var itemDescription = event.target.itemDescription.value;

    // call method to add new item
    addNewItemRequest(itemDescription);
  });



  /*
   *  on page load
   */
   getListRequest();
});
