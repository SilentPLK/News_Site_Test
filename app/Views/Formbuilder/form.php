<div class="container">
  <!-- Tab buttons -->
  <div class="tab-buttons">
    <button id="add-tab" class="btn btn-primary btn-lg">Add</button>
    <button id="preview-tab" class="btn btn-primary btn-lg">Preview</button>

  </div>
  <hr>

  <?= csrf_field() ?>

  <div class="tab-content" id="add-tab-content">
    <form id="jsonForm" style="width: 90%; left: 5%; position:relative"></form>
  </div>

  <div class="tab-content" id="preview-tab-content" style="display: none;">
    <form id="jsonFormPreview" style="width: 90%; left: 5%; position:relative"></form>
  </div>

<script>
  var baseUrl = "<?=base_url()?>"
  var tableData = <?=$tableData?>
</script>
<script src="<?=base_url(('js/formBuilder/formBuilder.js'))?>"></script>