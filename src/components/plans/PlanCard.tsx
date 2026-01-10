import React from 'react';
import Card, { CardBody, CardFooter, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Plan } from '../../api/plans.api';
import { formatCurrency } from '../../utils/format';
import { Check, Edit, Trash2, Users, UtensilsCrossed, Table2 } from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => {
  const isPremium = plan.name.toLowerCase().includes('enterprise');
  const isPopular = plan.name.toLowerCase().includes('professional');

  return (
    <Card
      className={`relative ${
        isPremium
          ? 'border-2 border-purple-500 shadow-xl'
          : isPopular
          ? 'border-2 border-indigo-500 shadow-xl'
          : ''
      }`}
    >
      {/* Popular/Premium Badge */}
      {(isPremium || isPopular) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant={isPremium ? 'secondary' : 'primary'} size="sm">
            {isPremium ? 'Premium' : 'Popular'}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
        <div className="mt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-extrabold text-gray-900">
              {formatCurrency(plan.price)}
            </span>
            <span className="text-gray-500 ml-1">
              /{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 capitalize">{plan.billingCycle} billing</p>
        </div>
      </CardHeader>

      <CardBody>
        {/* Plan Limits */}
        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
          {plan.limits?.maxTables && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Table2 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Max Tables</span>
              </div>
              <span className="font-semibold text-gray-900">{plan.limits.maxTables}</span>
            </div>
          )}
          {plan.limits?.maxMenuItems && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Max Menu Items</span>
              </div>
              <span className="font-semibold text-gray-900">{plan.limits.maxMenuItems}</span>
            </div>
          )}
          {plan.limits?.maxAdmins && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Max Admins</span>
              </div>
              <span className="font-semibold text-gray-900">{plan.limits.maxAdmins}</span>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900 mb-3">Features:</p>
          {plan.features && plan.features.length > 0 ? (
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No features listed</p>
          )}
        </div>

        {/* Active Status */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge variant={plan.isActive ? 'success' : 'gray'} size="sm">
              {plan.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardBody>

      <CardFooter className="space-x-2">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            fullWidth
            className="flex items-center justify-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(plan)}
            fullWidth
            className="flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
