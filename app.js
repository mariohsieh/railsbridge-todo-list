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

    // clear list first
    $('#list').empty();

    $.get(url, function(data) {
      console.log(data);
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

  // api call to mark item as completed
  function updateRequest(item, id, isCompleted) {
    $.ajax({
      type: 'PUT',
      url: url + 'items/' + id,
      data: { completed: !isCompleted },
      success: function(data) {
        (data.completed) ? item.addClass('completed') : item.removeClass('completed');
      }
    });
  }

  function deleteItemRequest(item, id) {
    $.ajax({
      type: 'DELETE',
      url: url + 'items/' + id,
      success: function(data) {
        item.remove();
      }
    });
  }


  /*
   *  event handlers
   */

  // add new item on submit
  $(document).on('submit','#add-form',function(event) {
    // cancel submission process
    event.preventDefault();
    // save text from input field
    var itemDescription = event.target.itemDescription.value;
    // call method to add new item
    addNewItemRequest(itemDescription);
    $('#create').text('');
  });

  // marking an item as complete on click
  $(document).on('click','.complete-button', function() {
    var item = $(this).parent(),
        itemId = item.attr('data-id'),
        isItemCompleted = item.hasClass('completed');

    // make api call to update request
    updateRequest(item, itemId, isItemCompleted);
  });

  // editing an item description
  $(document).on('click','.description', function() {
    var item = $(this).parent(),
        itemId = item.attr('data-id');

    //$(this).attr('contentEditable', true);
  });

  // deleting an item from list
  $(document).on('click','.delete-button', function() {
    var item = $(this).parent(),
        itemId = item.attr('data-id');

    // make api call to delete request
    deleteItemRequest(item, itemId);
  });

  // hover over input event
  $(document).on('mouseover','footer', function() {
    $(this).css('padding', '40px 0');
    $('.createIcon').hide();
    $('#create').show();
  });

  $(document).on('mouseout','footer', function() {
    $(this).css('padding', '20px 0');
    $('.createIcon').show();
    $('#create').hide();
  });

  /*
   *  on page load
   */
   getListRequest();
});
