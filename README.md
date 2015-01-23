Remodal
======================

The reactive bootstrap modal manager for Meteor.

Simply add `{{> remodal remodalData}}` to your layout.

You can then create & open modals by calling `Remodal.open('<modal name>', templateData)`


Usage
-----------------------

1. Wrap your modal in a template with the same name

```handlebars
<template name="myCustomModal">
  <div id="myCustomModal" class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">My Custom Modal</h3>
        </div>
        <div class="modal-body">
         <!-- ... -->
        </div>
      </div>
    </div>
  </div>
</template>

2. Then call from your code `Remodal.open('myCustomModal')`

3. When done, call `Remodal.close()`, the modal will be reactively removed from the DOM.

API
-------------------------


`Remodal.open(modalName, templateDate, beforeShown)`
Pass the modal name, and any template data.

If you need modify the DOM before the modal is displayed, pass a `beforeShown` callback.

`Remodal.close()`
Starts closing the modal, eg, begins fade-out animation

`Remodal.deferClose(timeoutMs)`
Pass a delay, and it will automatically close the modal after the timeout completes (eg, auto-close after 2 seconds)

`Remodal.data()`
Returns the data passed to `Remodal.open`


`Remdoal.fastReset()`
Destroys the modal & template without waiting for the close animation.
