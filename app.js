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
/*
    var item = itemTemplate.clone();
    item.attr('data-id',itemData.id);
    item.find('.description').text(itemData.description);
    item.find('.createdTime').text(itemData.created_at);
    if(itemData.updated_at) {
        item.find('.createdTime').text(itemData.updated_at);
    }
    if(itemData.completed) {
      item.addClass('completed');
    }
*/
    var newItem = '<li class="item" data-id="itemData.id">';
    newItem += '<span class="complete-button">&#10004;</span>';
    newItem += '<div class="description">'+itemData.description+'</div>';
    newItem += '<span class="delete-button">&#10004;</span>';
    newItem += '<span class="updatedTime disp-ib">Updated On: '+itemData.updated_at+'</span>';
    newItem += '</li>';
    list.append(newItem);
  }


  /*
   *  api calls
   */

  // api call to get list items
  function getListRequest() {
    // clear list first
    $('#list').empty();

    $.get(url, function(data) {
      var items = data.items;
      console.log(items);
      // loop through items and append to list for display
      items.forEach(function(item) {
        addItemToPage(item);
      });

      // make list sortable
      //$('#list').sortable();
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
  function completeRequest(item, id, isCompleted) {
    $.ajax({
      type: 'PUT',
      url: url + 'items/' + id,
      data: { completed: !isCompleted },
      success: function(data) {
        (data.completed) ? item.addClass('completed') : item.removeClass('completed');
      }
    });
  }

  // api call to delete list item
  function deleteItemRequest(item, id) {
    $.ajax({
      type: 'DELETE',
      url: url + 'items/' + id,
      success: function(data) {
        item.remove();
      }
    });
  }

  // api call to edit item description
  function updateRequest(item, id, descriptionData) {
    $.ajax({
      type: 'PUT',
      url: url + 'items/' + id,
      data: { description: descriptionData },
      success: function(data) {
        console.log(data);
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
    completeRequest(item, itemId, isItemCompleted);
  });

  // editing an item description
  $(document).on('click','.description', function() {
    var item = $(this).parent(),
        itemId = item.attr('data-id'),
        text = $(this).text();

    //$(this).attr('contentEditable', true);
    //updateRequest(item, itemId, text);
  });

  // deleting an item from list
  $(document).on('click','.delete-button', function() {
    var item = $(this).parent(),
        itemId = item.attr('data-id');

    // confirm with user to delete item
    var confirmDelete = confirm('Are you sure you want to delete this item?');

    // make api call to delete request if true
    if (confirmDelete)
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
