
const isObjectNotNull = item => typeof item === 'object' && !Array.isArray(item) && item !== null
//const canBeSplitbyPoint = str => str.split('.').length > 1;
const switchOperations = (k, v) => { 
	switch(k) {
		case 'gt': return cart[keyCriteria] > v
		case 'lt': return cart[keyCriteria] < v
		case 'gte': return cart[keyCriteria] >= v
		case 'lte': return cart[keyCriteria] <= v
	}
}
class EligibilityService {
	/**
	 * Compare cart data with criteria to compute eligibility.
	 * If all criteria are fulfilled then the cart is eligible (return true).
	 *
	 * @param cart
	 * @param criteria
	 * @return {boolean}
	 */
	isEligible(cart, criteria) {

		return Object.keys(criteria).every(keyCriteria => {
			const valueOfCriteriaByKey = criteria[keyCriteria]

			const keySplited = keyCriteria.split('.')
			if(keySplited.length > 1 ){
				const firstLevelKey = keySplited[0]
				const secondLevelKey = keySplited[1]
				if(cart[firstLevelKey]){
					const condition = cart[firstLevelKey]
					return cart[firstLevelKey][secondLevelKey] == valueOfCriteriaByKey
				}
				return  false
			}
			if (isObjectNotNull(valueOfCriteriaByKey)) {
				return Object.entries(valueOfCriteriaByKey).every(([key, value]) => {
					switch(key) {
						case 'gt': return cart[keyCriteria] > value
						case 'lt': return cart[keyCriteria] < value
						case 'gte': return cart[keyCriteria] >= value
						case 'lte': return cart[keyCriteria] <= value
						case 'in': return value.includes(cart[keyCriteria])
						case 'and': return Object.entries(value).every(([k, v]) => { 
							switch(k) {
								case 'gt': return cart[keyCriteria] > v
								case 'lt': return cart[keyCriteria] < v
								case 'gte': return cart[keyCriteria] >= v
								case 'lte': return cart[keyCriteria] <= v
								default: return false
							}
						})
						case 'or': return Object.entries(value).some(([k, v]) => { 
							switch(k) {
								case 'gt': return cart[keyCriteria] > v
								case 'lt': return cart[keyCriteria] < v
								case 'gte': return cart[keyCriteria] >= v
								case 'lte': return cart[keyCriteria] <= v
								default: return false
							}
						})
						default: return false
					}
				})
			}
			return cart[keyCriteria] == criteria[keyCriteria]
		})

	}
}

module.exports = {
	EligibilityService,
};
