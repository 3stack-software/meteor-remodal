Remodal
======================

The reactive bootstrap modal manager for Meteor.

Simply add `{{> remodal}}` to your layout.

You can then create & open modals by calling `Remodal.open('<modal name>', templateData)`


Usage
-----------------------

1. add `{{> remodal}}` to the `<body>` tag (or in your layout template).

2. Wrap your modal in a template with the same name

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
```

3. Then call from your code `Remodal.open('myCustomModal')`

4. When done, call `Remodal.close()`, the modal will be reactively removed from the DOM.

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


API - Advanced Usage (Targets)
---------------------------

You may need to add the remodal helper to multiple places on your page (eg, to work on a fullscreen element).
You can name each target by adding a second parameter to the helper `{{> remodal "my-target"}}`.

Then, at some other point in your code, you can set the current target with `Remodal.setTarget('my-target')`, and
revert with `Remodal.resetTarget()` (targets the base `{{> remodal}}`)



