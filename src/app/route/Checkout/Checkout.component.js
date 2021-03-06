/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { paymentMethodsType, shippingMethodsType } from 'Type/Checkout';
import CheckoutOrderSummary from 'Component/CheckoutOrderSummary';
import CheckoutGuestForm from 'Component/CheckoutGuestForm';
import CheckoutShipping from 'Component/CheckoutShipping';
import CheckoutBilling from 'Component/CheckoutBilling';
import ContentWrapper from 'Component/ContentWrapper';
import { CHECKOUT } from 'Component/Header';
import { addressType } from 'Type/Account';
import { TotalsType } from 'Type/MiniCart';
import { HistoryType } from 'Type/Common';
import Loader from 'Component/Loader';
import Meta from 'Component/Meta';

import './Checkout.style';
import Link from 'Component/Link';

export const SHIPPING_STEP = 'SHIPPING_STEP';
export const BILLING_STEP = 'BILLING_STEP';
export const DETAILS_STEP = 'DETAILS_STEP';

class Checkout extends PureComponent {
    static propTypes = {
        shippingMethods: shippingMethodsType.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        saveAddressInformation: PropTypes.func.isRequired,
        savePaymentInformation: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isDeliveryOptionsLoading: PropTypes.bool.isRequired,
        shippingAddress: addressType.isRequired,
        checkoutTotals: TotalsType.isRequired,
        orderID: PropTypes.string.isRequired,
        history: HistoryType.isRequired,
        checkoutStep: PropTypes.oneOf([
            SHIPPING_STEP,
            BILLING_STEP,
            DETAILS_STEP
        ]).isRequired
    };

    stepMap = {
        [SHIPPING_STEP]: {
            title: __('Shipping step'),
            render: this.renderShippingStep.bind(this),
            areTotalsVisible: true
        },
        [BILLING_STEP]: {
            title: __('Billing step'),
            render: this.renderBillingStep.bind(this),
            areTotalsVisible: true
        },
        [DETAILS_STEP]: {
            title: __('Thank you for your purchase!'),
            render: this.renderDetailsStep.bind(this),
            areTotalsVisible: false
        }
    };

    constructor(props) {
        super(props);

        this.updateHeader();
    }

    componentDidUpdate(prevProps) {
        const { checkoutStep } = this.props;
        const { checkoutStep: prevCheckoutStep } = prevProps;

        if (checkoutStep !== prevCheckoutStep) {
            this.updateHeader();
        }
    }

    updateHeader() {
        const { setHeaderState, checkoutStep, history } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        setHeaderState({
            name: CHECKOUT,
            title,
            onBackClick: () => history.push('/')
        });
    }

    renderTitle() {
        const { checkoutStep } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        return (
            <h1 block="Checkout" elem="Title">
                { title }
            </h1>
        );
    }

    renderGuestForm() {
        const { checkoutStep } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        return (
            <CheckoutGuestForm isBilling={ isBilling } />
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading
        } = this.props;

        return (
            <CheckoutShipping
              isLoading={ isDeliveryOptionsLoading }
              shippingMethods={ shippingMethods }
              saveAddressInformation={ saveAddressInformation }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
            />
        );
    }

    renderBillingStep() {
        const {
            paymentMethods = [],
            shippingAddress,
            savePaymentInformation
        } = this.props;

        return (
            <CheckoutBilling
              paymentMethods={ paymentMethods }
              shippingAddress={ shippingAddress }
              savePaymentInformation={ savePaymentInformation }
            />
        );
    }

    renderDetailsStep() {
        const { orderID } = this.props;

        return (
            <div block="Checkout" elem="Success">
                <p>{ __('Your order # is: %s', orderID) }</p>
                <p>{ __('We`ll email you an order confirmation with details and tracking info.') }</p>
                <a
                  block="Button"
                  mix={ { block: 'Checkout', elem: 'ContinueButton' } }
                  href="/"
                >
                    { __('Continue shopping') }
                </a>
            </div>
        );
    }

    renderStep() {
        const { checkoutStep } = this.props;
        const { render } = this.stepMap[checkoutStep];
        if (render) return render();
        return null;
    }

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={ isLoading } />;
    }

    renderSummary() {
        const { checkoutTotals, checkoutStep } = this.props;
        const { areTotalsVisible } = this.stepMap[checkoutStep];

        if (!areTotalsVisible) return null;

        return (
            <CheckoutOrderSummary totals={ checkoutTotals } />
        );
    }

    render() {
        return (
            <main block="Checkout">
                <Meta metaObject={ { title: 'Checkout' } } />
                <ContentWrapper
                  wrapperMix={ { block: 'Checkout', elem: 'Wrapper' } }
                  label={ __('Checkout page') }
                >
                    <div block="Checkout" elem="Step">
                        { this.renderTitle() }
                        { this.renderGuestForm() }
                        { this.renderStep() }
                        { this.renderLoader() }
                    </div>
                    { this.renderSummary() }
                </ContentWrapper>
            </main>
        );
    }
}

export default Checkout;
