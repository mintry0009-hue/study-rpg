from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.shop import ShopItem, UserShopItem
from app.models.user import User
from app.schemas.game import PurchaseResult, ShopItemRead

router = APIRouter(prefix="/shop", tags=["shop"])


def serialize_item(item: ShopItem, purchased_ids: set[int]) -> ShopItemRead:
    return ShopItemRead(
        id=item.id,
        key=item.key,
        name=item.name,
        description=item.description,
        category=item.category,
        price_points=item.price_points,
        purchased=item.id in purchased_ids,
    )


@router.get("", response_model=list[ShopItemRead])
def shop_items(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[ShopItemRead]:
    purchased_ids = {purchase.item_id for purchase in db.query(UserShopItem).filter(UserShopItem.user_id == user.id).all()}
    return [serialize_item(item, purchased_ids) for item in db.query(ShopItem).order_by(ShopItem.price_points).all()]


@router.post("/{item_id}/purchase", response_model=PurchaseResult)
def purchase(item_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> PurchaseResult:
    item = db.query(ShopItem).filter(ShopItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    purchased = db.query(UserShopItem).filter(UserShopItem.user_id == user.id, UserShopItem.item_id == item.id).first()
    if purchased:
        return PurchaseResult(item=serialize_item(item, {item.id}), remaining_points=user.points)
    if user.points < item.price_points:
        raise HTTPException(status_code=400, detail="Not enough points")
    user.points -= item.price_points
    db.add(UserShopItem(user_id=user.id, item_id=item.id))
    db.commit()
    db.refresh(user)
    return PurchaseResult(item=serialize_item(item, {item.id}), remaining_points=user.points)
