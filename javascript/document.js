( function($) {
	    var brokerage = 0.02;
		var budgetBox = $("#budget");
		var shareBox = $("#shareprice");
		var customProfitBox = $("#customPrice");

		budgetBox.bind('keyup', delegateBudget);
		shareBox.bind('keyup', delegateBudget);
		customProfitBox.bind('keyup', delegateBudgetForCustom);
		

		function delegateBudget() {
			budget = testNumeric.call(budgetBox);
			sharePrice = testNumeric.call(shareBox);
			customProfit = testNumeric.call(customProfitBox);
			executePermission = customProfitBox.val() === "" ? (budget && sharePrice) : (budget && sharePrice && customProfit)
			if(executePermission){
				updateValues(budget, sharePrice);
			}
		}
		
		function reflectChangeOnElement(fieldVal, budget, sharePrice, budgetPrice, shareQuantity, customProfit){
			$('#margin' + fieldVal + 'value').text(Math.round(budgetPrice));
			$('#margin' + fieldVal + 'shares').text(shareQuantity);
			$('#margin' + fieldVal + 'paisa5').text(calculateProfitAfterDeduction(sharePrice, (sharePrice + 0.05), shareQuantity));
			$('#margin' + fieldVal + 'paisa10').text(calculateProfitAfterDeduction(sharePrice, (sharePrice + 0.10), shareQuantity));
			$('#margin' + fieldVal + 'paisa20').text(calculateProfitAfterDeduction(sharePrice, (sharePrice + 0.20), shareQuantity));
			if(customProfit){
				$('#margin' + i + 'paisaCustom').text(calculateProfitAfterDeduction(sharePrice, (sharePrice + customProfit), shareQuantity));
			}
		}

		function updateValues(budget, sharePrice) {
			for ( i = 1; i <= 10; i++) {
				budgetPrice = i * budget;
				customProfit = testNumeric.call(customProfitBox);
				shareQuantity = (Math.round(budgetPrice / sharePrice) - 1);
				reflectChangeOnElement(i, budget, sharePrice, budgetPrice, shareQuantity, (customProfitBox.val() === "" ? false : customProfit));
			}
		}
		
		function delegateBudgetForCustom(e){
			budget = testNumeric.call(budgetBox);
			sharePrice = testNumeric.call(shareBox);			
			customProfit = testNumeric.call(customProfitBox);
			
			updateCustomValues(budget, sharePrice, customProfit)
		}
		
		function updateCustomValues(budget, sharePrice) {
			if(budget && sharePrice && customProfit){
				for ( i = 1; i <= 10; i++) {
					budgetPrice = i * budget;
					shareQuantity = (Math.round(budgetPrice / sharePrice) - 1);
					$('#margin' + i + 'paisaCustom').text(calculateProfitAfterDeduction(sharePrice, (sharePrice + customProfit), shareQuantity));
				}	
			}
		}
		
		function calculateProfitAfterDeduction(buyP, sellP, quantity){                               
          buyP=parseFloat(buyP);sellP=parseFloat(sellP);quantity=parseInt(quantity);                 
          if(buyP==0 || sellP==0) return 0;                                                          
          var profitWoBrkrg = (sellP-buyP)*quantity;                                                 
          var turnover = (sellP+buyP)*quantity;                                                      
          var brokerageBuy = parseInt(10000*(buyP < 100 ? (brokerage*quantity):(buyP*brokerage*quantity/100)))/10000;
          var brokerageSell = parseInt(10000*(sellP<100?(brokerage*quantity):(sellP*brokerage*quantity/100)))/10000;
          var serviceTax = parseInt(0.135*(brokerageBuy+brokerageSell)*10000)/10000;
          var stt = parseInt(sellP*quantity*0.00025*10000)/10000;                                    
          var transactionCharge = parseInt(turnover*0.000035*10000)/10000;
          var stampDuty = parseInt(turnover*0.00002*10000)/10000;                                    
          var sebiTurnoverCharges = parseInt(turnover*0.000001*10000)/10000;                         
          var netProfit = profitWoBrkrg - brokerageBuy - brokerageSell - serviceTax - stt - transactionCharge - stampDuty - sebiTurnoverCharges;
          netProfit = parseInt(netProfit*100)/100;
          return netProfit;
        }

		
		function testNumeric(){
			val = $(this).val();
			if($.isNumeric(val)){
				$(this).removeClass("error");
				return parseFloat(val);
			} else {
				$(this).addClass("error");
				$(".marginOnCustomPaise").text("");
				return false;
			}
		}
	}(window.jQuery))
