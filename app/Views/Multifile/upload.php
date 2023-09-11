<div class="container">
  <!-- Tab buttons -->
  <div class="tab-buttons">
    <button id="upload-tab" class="btn btn-primary btn-lg">Upload</button>
    <button id="edit-tab" class="btn btn-primary btn-lg">Edit</button>
  </div>
  <hr>
  <!-- Tab content -->
  <div class="tab-content" id="upload-tab-content">
    <ul>
      <?php foreach ($errors as $error): ?>
        <li><?= esc($error) ?></li>
      <?php endforeach ?>
    </ul>

    <?= form_open_multipart('upload/upload') ?>
      <div class="form-group">
        <label for="files">Select files:</label>
        <input type="file" id="files" name="files[]" class="form-control-file" accept="image/*" multiple>
        <?= csrf_field() ?>
      </div>
        <ul id="imageContainer" class="file-list"></ul><br>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>


  <div class="tab-content" id="edit-tab-content" style="display: none;">

  </div>

  <hr>
</div>
<script>
  var baseUrl = "<?= base_url()?>"
</script>
<script src="<?= base_url('js/multiFileUpload.js') ?>"></script>
