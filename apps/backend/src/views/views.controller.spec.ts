import { Test, TestingModule } from "@nestjs/testing";
import { ViewsController } from "./views.controller";
import { ViewsService } from "./views.service";

describe("ViewsController", () => {
  let controller: ViewsController;

  const mockViewsService = {
    updatePostViewCount: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewsController],
      providers: [{ provide: ViewsService, useValue: mockViewsService }],
    }).compile();

    controller = module.get<ViewsController>(ViewsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
