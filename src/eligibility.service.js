class EligibilityService {
	checkIfObject(item) {
		return typeof item === 'object' && !Array.isArray(item) && item !== null && item !== undefined
	}

	verifyConditionInNestedObjects(cart, keys, valueOfCriteriaByKey) {
		return keys.some((key, index) => {
			const datas = cart[key]
			if (datas) {
				if (Array.isArray(datas)) {
					const values = datas.map(data => data[keys[index + 1]])
					if (this.checkIfObject(valueOfCriteriaByKey)) {
						return this.switchOperations(null, values, valueOfCriteriaByKey)
					}
					return values.includes(valueOfCriteriaByKey)
				}
				return cart[key][keys[index + 1]] == valueOfCriteriaByKey
			}
		})
	}

	switchOperations(cart, keyCriteria, valueOfCriteriaByKey) {
		return Object.entries(valueOfCriteriaByKey).every(([key, value]) => {
			switch (key) {
				case 'gt':
					return cart[keyCriteria] > value
				case 'lt':
					return cart[keyCriteria] < value
				case 'gte':
					return cart[keyCriteria] >= value
				case 'lte':
					return cart[keyCriteria] <= value
				case 'in':
					return cart ? value.includes(cart[keyCriteria]) : keyCriteria.some(r => value.includes(r))
				case 'and':
					return Object.entries(value).every(([k, v]) => this.switchRangeOperations(cart, keyCriteria, k, v))
				case 'or':
					return Object.entries(value).some(([k, v]) => this.switchRangeOperations(cart, keyCriteria, k, v))
				default:
					return false
			}
		})
	}

	switchRangeOperations(cart, keyCriteria, k, v) {
		switch (k) {
			case 'gt':
				return cart[keyCriteria] > v
			case 'lt':
				return cart[keyCriteria] < v
			case 'gte':
				return cart[keyCriteria] >= v
			case 'lte':
				return cart[keyCriteria] <= v
			default:
				return false
		}
	}

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
			const splitedKeys = keyCriteria.split('.')
			if (splitedKeys.length > 1) {
				return this.verifyConditionInNestedObjects(cart, splitedKeys, valueOfCriteriaByKey)
			}
			if (this.checkIfObject(valueOfCriteriaByKey)) {
				return this.switchOperations(cart, keyCriteria, valueOfCriteriaByKey)
			}
			return cart[keyCriteria] == criteria[keyCriteria]
		})
	}
}

module.exports = {
	EligibilityService,
};
