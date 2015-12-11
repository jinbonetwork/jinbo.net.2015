<article class="inputset-radios <?php print $classes; ?>" style="<?php print $style; ?>">
<?php
	$labels = $data['labels'];
	$name = $data['radio-name'];
	$numRadios = count($labels);
	$numCol = $data['column'];
	$numRow = ceil($numRadios / $numCol);
	echo '<div class="radio-wrap" data-column="'.$numCol.'">';
	for($i = 0; $i < $numRadios; $i++){
		$id = $name.'-'.$i;
		if($i % $numCol == 0){
			echo '<div class="radio-row">';
		}
		echo '<div class="radio-col">';
		echo '<input type="radio" id="'.$id.'" name="'.$name.'" value="'.$id.'">';
		echo '<label for="'.$id.'" class="radio-button"><i class="radio-button-o fa fa-circle"></i></label>';
		echo '<label for="'.$id.'"><h3>'.$labels[$i].'</h3></label>';
		echo '</div>';
		if($i % $numCol == $numCol - 1 || $i == $numRadios - 1){
			echo '</div>';
		}
	}
	echo '</div>';
	echo '<p>'.$data['comment'].'</p>';
?>
</article>
