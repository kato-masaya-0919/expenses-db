$(function(){	
	$(document).ready( function(){
		ajaxSearch();
	});
	$('#search-btn').on('click', function(){
		ajaxSearch();
	});
	$('#check-btn').on('click', function(){
		alertid();
	});
	$('#search-date-from-y, #search-date-from-m').change(function(){
		setDay('from');
	});
	$('#search-date-to-y, #search-date-to-m').change(function(){
		setDay('to');
	});
});

function alertid(){
	result = new Array();
	$('#expenses td').each(function (index, row) {
	    if ($(row).find('input:checkbox').is(':checked')){
	        result.push($(this).nextAll().eq(0).text().replace('ID：',''));
	    }
	});
	alert(result);
};

function setDay(fromOrto){
	var lastday = setLastDay($('#search-date-'+fromOrto+'-y').val(), $('#search-date-'+fromOrto+'-m').val());
	var option = '<option value="" selected="selected"></option>\n';
	for (var i = 1; i <= lastday; i++) {
		option += '<option value="' + i + '">' + i + '</option>\n';
	}
	$('#search-date-'+fromOrto+'-d').html(option);
};

function setLastDay(year, month){
	var lastday = new Array('', 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
		lastday[2] = 29;
	}
    return lastday[month];
}

function ajaxSearch(){
	
	loadingIn();
	
	var id,datefrom,dateto,yobi,use,categ,name,price,rate,paystatus,remarks;
	
	id=$('#search-id').val();
	
	if($('#search-date-from-y').val()!='' && $('#search-date-from-m').val()!='' && $('#search-date-from-d').val()!=''){
		datefrom=$('#search-date-from-y').val()+'-'+$('#search-date-from-m').val()+'-'+$('#search-date-from-d').val();	
	}
	else if($('#search-date-from-y').val()!='' && $('#search-date-from-m').val()!='' && $('#search-date-from-d').val()==''){
		datefrom=$('#search-date-from-y').val()+'-'+$('#search-date-from-m').val()+'-1';
	}
	else{
		datefrom='';
	}
	
	if($('#search-date-to-y').val()!='' && $('#search-date-to-m').val()!='' && $('#search-date-to-d').val()!=''){
		dateto=$('#search-date-to-y').val()+'-'+$('#search-date-to-m').val()+'-'+$('#search-date-to-d').val();	
	}
	else if($('#search-date-to-y').val()!='' && $('#search-date-to-m').val()!='' && $('#search-date-to-d').val()==''){
		dateto=$('#search-date-to-y').val()+'-'+$('#search-date-to-m').val()+'-31';
	}
	else{
		dateto='';
	}
	
	yobi=$('#search-yobi').val();
	use=$('#search-use').val();
	categ=$('#search-categ').val();
	name=$('#search-name').val();
	price=$('#search-price').val();
	rate=$('#search-rate').val();
	paystatus=$('#search-paystatus').val();
	remarks=$('#search-remarks').val();
	
	$.ajax({
		url:'expenses_db/Search',
		type:'POST',
		cache:false,
		data: {
			id: id,
			datefrom: datefrom,
			dateto: dateto,
			yobi: yobi,
			use: use,
			categ: categ,
			name: name,
			price: price,
			rate: rate,
			paystatus: paystatus,
			remarks: remarks
			}
	})
	.done(function(data){
		loadData(data);
	})
	.fail(function(textStatus, errorThrown){
		alert('検索に失敗しました' + '\n' + 'status:' + textStatus + '\n' +'errorThrown:' + errorThrown);
	});
	
	loadingOut();
};

function loadData(data){
	$('#expenses').empty();
	$('#pricesum').empty();
	
	// タイトル専用
	var title_col_data;
	// データ用
	var row_data;
	var col_data;

	// 行のループ  ( <tr></tr> )
	$.each(data,function(index,value){
		// 合計テーブル
		if (index == 0){
			$.each(value,function(key,val){
				title_col_data=$('#pricesum').append('<th>'+key+'</th>');
			});
			// テーブルに行を追加	
			row_data = $('#pricesum').append('<tr></tr>');
			
			// 列のループ ( <td></td> )
			$.each(value,function(key,val){
				// 行に列を追加
				col_data = row_data.append('<td>'+val+'</td>');
			});
		}
		
		//一覧
		// 初回はタイトル作成
		if (index == 1){
			//　選択チェックボックス列のタイトルを追加
			title_col_data=$('#expenses').append('<th class = th-select-chk><input type="checkbox" class ="allchk"></th>');
			// 列のループ ( <th></th> )
			$.each(value,function(key,val){
				title_col_data=$('#expenses').append('<th class = th-' + key +'>'+key+'</th>');
			});
		}
		
		if (index >= 1){
			// テーブルに行を追加
			row_data = $('#expenses').append('<tr></tr>');
			
			//　選択チェックボックス列を追加
			col_data = row_data.append('<td class = td-select-chk><span>選択：</span><input type="checkbox"></td>');
			
			// 列のループ ( <td></td> )
			$.each(value,function(key,val){
				// 行に列を追加
				col_data = row_data.append('<td class = td-' + key +'><span>'+key+'：</span>'+val+'</td>');
			});
		}
	});
}

function loadingIn(){
	$(document).ajaxSend(function() {$("#overlay").fadeIn(500);});
}

function loadingOut(){
	setTimeout(function(){$("#overlay").fadeOut(500);},3000);
}

