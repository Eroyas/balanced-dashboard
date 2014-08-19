var Computed = {
	isSelected: function() {
		var routes = _.toArray(arguments);

		return function() {
			return routes.indexOf(this.get('controllers.application.currentRouteName')) >= 0;
		}.property('controllers.application.currentRouteName');
	}
};

Balanced.MarketplaceController = Balanced.ObjectController.extend({

	needs: ['application', 'notification_center'],

	transactionSelected: Computed.isSelected('marketplace.transactions', 'credits', 'debits', 'holds', 'refunds', 'reversals'),
	orderSelected: Computed.isSelected('marketplace.orders', 'orders'),
	customerSelected: Computed.isSelected('marketplace.customers', 'customer'),
	fundingInstrumentSelected: Computed.isSelected('marketplace.funding_instruments', 'bank_accounts', 'cards'),
	disputeSelected: Computed.isSelected('marketplace.disputes', 'dispute'),
	logSelected: Computed.isSelected('marketplace.logs', 'log'),
	invoiceSelected: Computed.isSelected('marketplace.invoices', 'invoice'),
	settingSelected: Computed.isSelected('marketplace.settings'),

	// Note: need this since bind-attr only works for a single property
	paymentSelected: Ember.computed.or('transactionSelected', 'orderSelected'),
	myMarketplaceSelected: Ember.computed.or('settingSelected', 'invoiceSelected'),

	formattedEscrowAmount: function() {
		var escrow = this.get('in_escrow');
		if (isNaN(escrow)) {
			return '$--';
		}

		return Balanced.Utils.formatCurrency(escrow);
	}.property('in_escrow'),

	updateGuestNotification: function() {
		var name = "GuestNotification";
		var controller = this.get("controllers.notification_center");
		var message = "You're logged in as a guest user. Create an account to claim your test marketplace.";

		controller.clearNamedAlert(name);

		if (this.get('auth.isGuest')) {
			controller.alertInfo(message, {
				name: name
			});
		}
	}.observes("auth.isGuest"),

	updateBankAccountNotifications: function() {
		var name = "BankAccountVerification";
		var mp = this.get("marketplace");
		var controller = this.get("controllers.notification_center");

		if (mp && mp.get("isLoaded")) {
			Balanced.BankAccountVerificationMessage
				.forMarketplace(mp)
				.then(function(message) {
					controller.clearNamedAlert(name);
					if (message) {
						controller.alertError(message, {
							name: name
						});
					}
				});
		}
	}.observes("marketplace.isLoaded"),

});

Balanced.MarketplaceCreditsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceDebitsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceHoldsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceRefundsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});
