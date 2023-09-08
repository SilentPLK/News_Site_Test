

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


<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
      <h4 class="modal-title" id="modalTitle">Delete Confirmation</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p id="modalText">Are you sure you want to delete the selected rows?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger" id="confirmDeleteButton">Delete</button>
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