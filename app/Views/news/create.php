

<div class="container">
  
  <table cellpadding="0" cellspacing="0" border="0" class="dataTable table table-striped" id="newsList">

  </table>

</div>
<?= csrf_field() ?>
<form id="jsonForm" style="position:relative; width:80%; left:10%"></form>

<script>
var columnDefs = <?= $configure ?> 
var dataSet = <?= $data ?> 
var references = <?= $references ?>
</script>
<script src="<?= base_url('js/newsListEditor.js') ?>"></script>
<script src="<?= base_url('js/dynamicJsonForm.js') ?>"></script>