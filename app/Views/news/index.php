<!--<h2><?= esc($title) ?></h2>

<?php if (! empty($news) && is_array($news)): ?>

    <?php foreach ($news as $news_item): ?>

        <h3><?= esc($news_item['title']) ?></h3>

        <div class="main">
            <?= esc($news_item['body']) ?>
        </div>
        <p><a href="/news/<?= esc($news_item['slug'], 'url') ?>">View article</a></p>

    <?php endforeach ?>

<?php else: ?>

    <h3>No News</h3>

    <p>Unable to find any news for you.</p>

<?php endif ?>-->
<div class="container">
    <table cellpadding="0" cellspacing="0" border="0" class="dataTable table table-striped" id="newsList">

    </table>
</div>

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
<script src="<?= base_url('js/dynamicJsonForm.js') ?>"></script>
<script src="<?= base_url('js/newsList/newsLister.js') ?>"></script>