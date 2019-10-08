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

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Html from 'Component/Html';

export const PAYPAL_BUTTON = 'PAYPAL_BUTTON';
export const PAYPAL_SCRIPT = 'PAYPAL_SCRIPT';

const paypalScript = `<script id="${PAYPAL_SCRIPT}" src="https://www.paypal.com/sdk/js?client-id=sb"></script>`;

export default class PayPal extends PureComponent {
    static propTypes = {
        paypal: PropTypes.any
    };

    static defaultProps = {
        paypal: undefined
    };

    render() {
        const { paypal } = this.props;
        const PayPalButton = paypal && paypal.Buttons.driver('react', { React, ReactDOM });

        return (
            <>
                <Html content={ paypalScript } />
                { paypal !== undefined ? <PayPalButton /> : null }
            </>
        );
    }
}
