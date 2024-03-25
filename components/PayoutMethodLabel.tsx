import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { PayoutMethod, PayoutMethodType } from '../lib/graphql/types/v2/graphql';

import { PayoutMethodIcon } from './PayoutMethodIcon';

export const I18nPayoutMethodLabels = defineMessages({
  [PayoutMethodType.ACCOUNT_BALANCE]: {
    id: 'PayoutMethod.AccountBalance',
    defaultMessage: 'Open Collective (Account Balance)',
  },
  [PayoutMethodType.BANK_ACCOUNT]: {
    id: 'BankAccount',
    defaultMessage: 'Bank account',
  },
  [PayoutMethodType.PAYPAL]: {
    id: 'PayoutMethod.Type.Paypal',
    defaultMessage: 'PayPal',
  },
  [PayoutMethodType.OTHER]: {
    id: 'PayoutMethod.Type.Other',
    defaultMessage: 'Other',
  },
});

type PayoutMethodLabelProps = {
  showIcon?: boolean;
  payoutMethod?: Omit<PayoutMethod, 'id'>;
};

export function PayoutMethodLabel(props: PayoutMethodLabelProps) {
  if (!props.payoutMethod) {
    return null;
  }

  const pm = props.payoutMethod;

  let label: React.ReactNode = props.payoutMethod.name;

  if (!label) {
    switch (pm.type) {
      case PayoutMethodType.PAYPAL:
        label = pm.data?.email;
        break;
      case PayoutMethodType.ACCOUNT_BALANCE:
        break;
      case PayoutMethodType.BANK_ACCOUNT: {
        if (pm.data?.details?.IBAN) {
          label = `IBAN ${pm.data.details.IBAN}`;
        } else if (pm.data?.details?.accountNumber) {
          label = `A/N ${pm.data.details.accountNumber}`;
        } else if (pm.data?.details?.clabe) {
          label = `Clabe ${pm.data.details.clabe}`;
        } else if (pm.data?.details?.bankgiroNumber) {
          label = `BankGiro ${pm.data.details.bankgiroNumber}`;
        } else if (pm.data?.accountHolderName && pm.data?.currency) {
          label = `${pm.data.accountHolderName} (${pm.data.currency})`;
        }
        break;
      }
      case PayoutMethodType.OTHER: {
        const content = pm.data?.content?.replace(/\n|\t/g, ' ');
        if (content) {
          label = (
            <span>
              <FormattedMessage {...I18nPayoutMethodLabels[PayoutMethodType.OTHER]} /> - {content}
            </span>
          );
        }
        break;
      }
    }
  }

  if (!label) {
    label = <FormattedMessage {...I18nPayoutMethodLabels[pm.type]} />;
  }

  if (props.showIcon) {
    return (
      <span className="whitespace-nowrap">
        <PayoutMethodIcon payoutMethod={pm} />
        &nbsp;
        {label}
      </span>
    );
  }

  return label;
}

// if (!payoutMethod) {
//   return this.props.intl.formatMessage(payoutMethodLabels.none);
// } else if (payoutMethod.id) {
//   } else if (payoutMethod.type === PayoutMethodType.OTHER) {
//     const content = payoutMethod.data?.content?.replace(/\n|\t/g, ' ');
//     const i18nType = i18nPayoutMethodType(this.props.intl, payoutMethod.type);
//     return content ? `${i18nType} - ${truncate(content, { length: MAX_PAYOUT_OPTION_DATA_LENGTH })}` : i18nType;
//   } else {
//     return i18nPayoutMethodType(this.props.intl, payoutMethod.type);
//   }
