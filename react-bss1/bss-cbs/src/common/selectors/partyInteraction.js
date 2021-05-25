import { createSelector } from 'reselect';
import _ from 'lodash';

const fetchInteractionByType = (partyInteraction, type) => {
  let item = null;
  if (partyInteraction) {
    partyInteraction.interactionItem.forEach(interactionItem => {
      if (interactionItem.item['@type'].toLowerCase() === type.toLowerCase()) {
        item = interactionItem;
      }
    });
  }
  return item;
};

export const fetchProductInteraction = (state, type) => {
  const activeInteractionID = _.get(state, 'app.activeInteraction', {});
  const activeInteraction = _.get(state, 'entities.partyInteraction.byId', {})[
    activeInteractionID
  ];
  const item = null;
  if (activeInteraction) {
    for (const interactionItem of activeInteraction.interactionItem) {
      if (
        interactionItem &&
        interactionItem.item &&
        interactionItem.item['@type'] &&
        interactionItem.item['@type'].toLowerCase() === type.toLowerCase()
      ) {
        return interactionItem;
      }
    }
  }
  return item;
};

export const fetchInteractionByTypeSelector = createSelector(
  fetchInteractionByType,
  interaction => interaction
);

export const fetchProductOrderInteraction = createSelector(
  fetchProductInteraction,
  interaction => interaction
);
