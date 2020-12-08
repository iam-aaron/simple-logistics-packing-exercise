import { ContainerSpec, OrderRequest, ShipmentRecord, Containers } from "./interfaces";

export class OrderHandler {

  constructor(private parameters: { containerSpecs: ContainerSpec[] }) {}

  packOrder(orderRequest: OrderRequest) {
    const generatedShipmentDetails: ShipmentRecord = {
      orderId: "",
      totalVolume: {
        unit: "",
        value: 0,
      },
      containers: [],
    };

    let unit = "";
    let dim: number[];
    let contChecker = null;
    let sumVolume = 0;
    
    for(const product of orderRequest.products){
        unit = product.dimensions.unit;
        dim = [product.dimensions.length, product.dimensions.width, product.dimensions.height];
        generatedShipmentDetails.orderId = orderRequest.id;
        sumVolume = sumVolume + this.calculateTotalProductVolume(product.orderedQuantity, dim);
        try{
          generatedShipmentDetails.containers = this.sortItems(contChecker,0,product.id,product.dimensions.unit,product.orderedQuantity,dim);
        }
        catch(e) {
          console.log('[SORTING PROBLEM]', e);
        }
        contChecker = generatedShipmentDetails.containers;
        
    }
    generatedShipmentDetails.totalVolume.unit = "cubic " + unit;
    generatedShipmentDetails.totalVolume.value = sumVolume
    return generatedShipmentDetails;
    
  }

  protected bestBox(unit:string, totalPackageVolume: number){
      let bestBox = '';
      let boxOptionVolume = 0;
      let volumeGap = null; 

      for(const boxOptionType of this.parameters.containerSpecs) {
          if (!boxOptionType.dimensions.unit.match(unit)){
              throw new Error("There's a mismatch in our unit of measure, please check your parameters");
          }

          boxOptionVolume = boxOptionType.dimensions.length * boxOptionType.dimensions.width * boxOptionType.dimensions.height;

          if (totalPackageVolume <= boxOptionVolume && (volumeGap === null || volumeGap >= (boxOptionVolume-totalPackageVolume))){ //for choosing the best fit
              volumeGap = boxOptionVolume-totalPackageVolume;
              bestBox = boxOptionType.containerType;
          }
      }

      return (volumeGap === null ? null : bestBox);

  }

  protected sortItems( cont: Containers[] | null, rem: number, prodID: string, unit:string, itemCount: number, dim: number[]): Containers[]{
      let totalPackageVolume = 0;
      let container = [{
              containerType: '',
              containingProducts: [{
                  id: '',
                  quantity: 0
              }]
          }];

      let box = null;
      let remainingItem = rem;

      while(itemCount > 0 && box === null){
          totalPackageVolume = this.calculateTotalProductVolume(itemCount, dim);
          box = this.bestBox(unit, totalPackageVolume);
          if (box === null){
              itemCount = itemCount - 1;
              remainingItem = remainingItem + 1;
              if (itemCount === 0){
                  throw new Error("Your item is too big for our available boxes");
              }
          }
      }

      if (box !== null){
          if(cont !== null){
              cont.push({'containerType': box,'containingProducts':[{'id': prodID,'quantity': itemCount}]});
          }else{
              container.pop();
              container.push({'containerType': box,'containingProducts':[{'id': prodID,'quantity': itemCount}]});
          }
      }

      if (remainingItem > 0){
          if (cont === null){
                cont = container;
            }
          return this.sortItems(cont, 0, prodID, unit, remainingItem, dim);
      } else {
          if (cont === null){
              cont = container;
          }
          return cont!;
      }

  }

  protected calculateTotalProductVolume(itemCount: number, dimension: number[]){
      const perPackageVolume = dimension.reduce(function(productDimension, currentDimension) {
          return productDimension * currentDimension;
      }, 1);
 
      const totalPackageVolume = perPackageVolume * itemCount;

      return totalPackageVolume;
  }
  
}

/////////THIS IS THE TESTING AREA

//Define your Container Specifications
const containerSpecs: ContainerSpec[] = [
    {
      containerType: "Cardboard A",
      dimensions: {
        unit: "centimeter",
        length: 30,
        width: 30,
        height: 30,
      },
    },
    {
      containerType: "Cardboard B",
      dimensions: {
        unit: "centimeter",
        length: 10,
        width: 20,
        height: 20,
      }, 
    },
  ];

//ORDER REQUEST
const orderRequest: OrderRequest = {
    id: "ORDER-001",
    products: [
      {
        id: "PRODUCT-001",
        name: "GOOD FORTUNE COOKIES",
        orderedQuantity: 9, 
        unitPrice: 13.4,
        dimensions: {
          unit: "centimeter",
          length: 10,
          width: 10,
          height: 30,
        },
      },
    ],
  };

  const orderHandler = new OrderHandler({ containerSpecs });
  console.log(JSON.stringify(orderHandler.packOrder(orderRequest), null, 2));