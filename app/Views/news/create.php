

<div class="container">
  
  <table cellpadding="0" cellspacing="0" border="0" class="dataTable table table-striped" id="newsList">

  </table>

</div>
<?= csrf_field() ?>



<div class="modal fade" id="jsonModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="myModalLabel">Form Modal</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="jsonForm"></form>
      </div>
    </div>
  </div>
</div>

<script>
var columnDefs = <?= $configure ?> 
var dataSet = <?= $data ?> 
var references = <?= $references ?>
</script>
<script src="<?= base_url('js/newsListEditor.js') ?>"></script>
<script src="<?= base_url('js/dynamicJsonForm.js') ?>"></script>