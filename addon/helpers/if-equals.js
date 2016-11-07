import Ember from 'ember';

export function ifEquals(params/*, hash*/) {
    console.log(params);
  return params;
}

export default Ember.Helper.helper(ifEquals);
